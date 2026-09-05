import { createHash } from "node:crypto";
import ExcelJS from "exceljs";
import { PDFDocument } from "pdf-lib";
import { PDFArray, PDFRawStream, decodePDFRawStream } from "pdf-lib/cjs/core/index.js";

export type ParsedScalar = string | number | boolean | null;

export type ParsedCell = {
  address: string;
  rawValue: ParsedScalar;
  displayValue: string | null;
  formula: string | null;
  cachedFormulaResult: boolean;
};

export type ParsedTable = {
  range: string;
  headerRange: string;
  headers: string[];
  period: string | null;
  unit: string | null;
};

export type ParsedSheet = {
  name: string;
  populatedRange: string | null;
  cells: ParsedCell[];
  tables: ParsedTable[];
};

type ParsedSourceBase = {
  sourceId: string;
  filename: string;
  sha256: `sha256:${string}`;
  warnings: string[];
  extraction: "parsed" | "verified_cache";
};

export type ParsedWorkbookSource = ParsedSourceBase & { kind: "workbook"; sheets: ParsedSheet[] };
export type ParsedPdfSource = ParsedSourceBase & { kind: "pdf"; pages: { page: number; text: string }[] };
export type ParsedCsvSource = ParsedSourceBase & { kind: "csv"; headers: string[]; rows: { row: number; values: string[] }[] };
export type ParsedTextSource = ParsedSourceBase & { kind: "text"; lines: string[] };
export type ParsedSource = ParsedWorkbookSource | ParsedPdfSource | ParsedCsvSource | ParsedTextSource;

export type TextLocator =
  | { kind: "pdf_page"; page: number; excerpt: string }
  | { kind: "csv_cell"; row: number; column: string }
  | { kind: "text_lines"; startLine: number; endLine: number };

export type ParseFailureReason = "PASSWORD_PROTECTED" | "OCR_REQUIRED" | "UNSUPPORTED" | "PARSE_FAILED";
export type ParseResult = { ok: true; source: ParsedSource } | { ok: false; sourceId: string; filename: string; reason: ParseFailureReason; detail: string };

export type WorkbookLocator =
  | { kind: "spreadsheet_cell"; sheet: string; cell: string }
  | { kind: "spreadsheet_range"; sheet: string; range: string };

type ParseWorkbookOptions = {
  sourceId: string;
  filename: string;
  expectedSha256?: string;
  cachedExtraction?: ParsedWorkbookSource;
};

type ParseOptions<T extends ParsedSource = ParsedSource> = { sourceId: string; filename: string; expectedSha256?: string; cachedExtraction?: T };

const cellReference = /^[A-Z]+[1-9][0-9]*$/;
const rangeReference = /^([A-Z]+[1-9][0-9]*):([A-Z]+[1-9][0-9]*)$/;

function scalar(value: ExcelJS.CellValue): ParsedScalar {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (value instanceof Date) return value.toISOString();
  return null;
}

function parsedCell(cell: ExcelJS.Cell): ParsedCell {
  const value = cell.value;
  const formula = value && typeof value === "object" && "formula" in value ? String(value.formula) : null;
  const formulaResult = formula && value && typeof value === "object" && "result" in value ? value.result : null;
  const rawValue = formula ? scalar(formulaResult as ExcelJS.CellValue) : scalar(value);
  const percentFormat = typeof rawValue === "number" && (cell.numFmt ?? "").match(/0(?:\.(0+))?%/);
  const displayValue = percentFormat
    ? `${(rawValue * 100).toFixed(percentFormat[1]?.length ?? 0)}%`
    : rawValue === null ? null : cell.text;
  return {
    address: cell.address,
    rawValue,
    displayValue,
    formula,
    cachedFormulaResult: formula !== null && rawValue !== null,
  };
}

function columnName(number: number) {
  let result = "";
  for (let current = number; current > 0; current = Math.floor((current - 1) / 26)) {
    result = String.fromCharCode(65 + ((current - 1) % 26)) + result;
  }
  return result;
}

function coordinates(address: string) {
  const match = address.match(/^([A-Z]+)([1-9][0-9]*)$/)!;
  const column = [...match[1]].reduce((total, character) => total * 26 + character.charCodeAt(0) - 64, 0);
  return { row: Number(match[2]), column };
}

function inferTable(sheet: ExcelJS.Worksheet, minRow: number, minColumn: number, maxRow: number, maxColumn: number): ParsedTable {
  const headers = Array.from({ length: maxColumn - minColumn + 1 }, (_, offset) => sheet.getCell(minRow, minColumn + offset).text);
  const headerText = headers.join(" ");
  const period = headerText.match(/\bFY\d{2,4}\b/i)?.[0].toUpperCase() ?? null;
  const unit = /(?:share|percent|percentage|%)/i.test(headerText) ? "percentage_of_revenue" : null;
  return {
    range: `${columnName(minColumn)}${minRow}:${columnName(maxColumn)}${maxRow}`,
    headerRange: `${columnName(minColumn)}${minRow}:${columnName(maxColumn)}${minRow}`,
    headers,
    period,
    unit,
  };
}

function sameScalar(left: ParsedScalar, right: ParsedScalar) {
  return left === right;
}

function verifyCachedExtraction(parsed: ParsedWorkbookSource, cached: ParsedWorkbookSource): ParsedWorkbookSource {
  if (cached.kind !== "workbook" || cached.sha256 !== parsed.sha256) throw new Error("Cached extraction source hash does not match workbook bytes");
  if (!cached.sheets.some(({ cells }) => cells.length > 0)) throw new Error("Cached extraction has no addressable workbook content to verify");
  for (const cachedSheet of cached.sheets) {
    const sheet = parsed.sheets.find(({ name }) => name === cachedSheet.name);
    if (!sheet) throw new Error(`Cached extraction references missing sheet: ${cachedSheet.name}`);
    for (const cachedCell of cachedSheet.cells) {
      const actual = sheet.cells.find(({ address }) => address === cachedCell.address);
      if (!actual || !sameScalar(actual.rawValue, cachedCell.rawValue) || actual.displayValue !== cachedCell.displayValue) {
        throw new Error(`Cached extraction does not match ${cachedSheet.name}!${cachedCell.address}`);
      }
    }
  }
  return { ...cached, sourceId: parsed.sourceId, filename: parsed.filename, warnings: [...cached.warnings], extraction: "verified_cache" };
}

export async function parseWorkbook(bytes: Uint8Array, options: ParseWorkbookOptions): Promise<ParsedWorkbookSource> {
  const sha256 = `sha256:${createHash("sha256").update(bytes).digest("hex")}` as const;
  if (options.expectedSha256 && options.expectedSha256 !== sha256) throw new Error("Workbook source hash mismatch");

  const workbook = new ExcelJS.Workbook();
  try {
    // ExcelJS's bundled Buffer declaration lags Node's resizable Buffer type.
    await workbook.xlsx.load(Buffer.from(bytes) as never);
  } catch (cause) {
    throw new Error("Workbook could not be parsed; no evidence was emitted", { cause });
  }

  const warnings: string[] = [];
  if (/\.xlsm$/i.test(options.filename)) warnings.push("Macros were retained as inert source content and were not executed");
  const sheets = workbook.worksheets.map((sheet): ParsedSheet => {
    const cells: ParsedCell[] = [];
    let minRow = Infinity, minColumn = Infinity, maxRow = 0, maxColumn = 0;
    sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => row.eachCell({ includeEmpty: false }, (cell, columnNumber) => {
      const parsed = parsedCell(cell);
      cells.push(parsed);
      minRow = Math.min(minRow, rowNumber); minColumn = Math.min(minColumn, columnNumber);
      maxRow = Math.max(maxRow, rowNumber); maxColumn = Math.max(maxColumn, columnNumber);
      if (parsed.formula?.includes("[")) warnings.push(`External workbook formula was not resolved: ${sheet.name}!${cell.address}`);
      if (parsed.formula && !parsed.cachedFormulaResult) warnings.push(`Formula has no cached result: ${sheet.name}!${cell.address}`);
    }));
    const populatedRange = maxRow ? `${columnName(minColumn)}${minRow}:${columnName(maxColumn)}${maxRow}` : null;
    return { name: sheet.name, populatedRange, cells, tables: maxRow ? [inferTable(sheet, minRow, minColumn, maxRow, maxColumn)] : [] };
  });
  const parsed: ParsedWorkbookSource = { kind: "workbook", sourceId: options.sourceId, filename: options.filename, sha256, sheets, warnings, extraction: "parsed" };
  return options.cachedExtraction ? verifyCachedExtraction(parsed, options.cachedExtraction) : parsed;
}

export function validateWorkbookLocator(source: ParsedSource, locator: WorkbookLocator): ParsedCell[] {
  if (source.kind !== "workbook") throw new Error("Spreadsheet locator requires a workbook source");
  const sheet = source.sheets.find(({ name }) => name === locator.sheet);
  if (!sheet) throw new Error(`Unknown workbook sheet: ${locator.sheet}`);
  if (locator.kind === "spreadsheet_cell") {
    if (!cellReference.test(locator.cell)) throw new Error(`Invalid cell reference: ${locator.cell}`);
    const cell = sheet.cells.find(({ address }) => address === locator.cell);
    if (!cell) throw new Error(`Cell is outside populated workbook content: ${locator.sheet}!${locator.cell}`);
    return [cell];
  }
  const match = locator.range.match(rangeReference);
  if (!match) throw new Error(`Invalid range reference: ${locator.range}`);
  const start = sheet.cells.findIndex(({ address }) => address === match[1]);
  const end = sheet.cells.findIndex(({ address }) => address === match[2]);
  if (start < 0 || end < 0) throw new Error(`Range is outside populated workbook content: ${locator.sheet}!${locator.range}`);
  const first = coordinates(match[1]);
  const last = coordinates(match[2]);
  if (first.row > last.row || first.column > last.column) throw new Error(`Invalid range order: ${locator.range}`);
  return sheet.cells.filter((cell) => {
    const current = coordinates(cell.address);
    return current.row >= first.row && current.row <= last.row && current.column >= first.column && current.column <= last.column;
  });
}

function sourceHash(bytes: Uint8Array) {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}` as const;
}

function assertHash(hash: string, expected?: string) {
  if (expected && expected !== hash) throw new Error("Source hash mismatch");
}

function decodePdfString(value: string, hex: boolean) {
  if (hex) return Buffer.from(value.replace(/\s/g, ""), "hex").toString("latin1").replace(/\x97/g, "—");
  return value.replace(/\\([nrtbf()\\])/g, (_, escaped: string) => ({ n: "\n", r: "\r", t: "\t", b: "\b", f: "\f", "(": "(", ")": ")", "\\": "\\" })[escaped] ?? escaped)
    .replace(/\\([0-7]{1,3})/g, (_, octal: string) => String.fromCharCode(Number.parseInt(octal, 8)));
}

function pageText(document: PDFDocument, pageIndex: number) {
  const contents = document.getPages()[pageIndex].node.Contents();
  if (!contents) return "";
  const references = contents instanceof PDFArray ? contents.asArray() : [contents];
  const operators: string[] = [];
  for (const reference of references) {
    const stream = document.context.lookup(reference);
    if (!(stream instanceof PDFRawStream)) continue;
    const decoded = Buffer.from(decodePDFRawStream(stream).decode()).toString("latin1");
    for (const match of decoded.matchAll(/<([0-9A-Fa-f\s]+)>\s*Tj|\(((?:\\.|[^\\)])*)\)\s*Tj|\[((?:.|\n)*?)\]\s*TJ/g)) {
      if (match[1]) operators.push(decodePdfString(match[1], true));
      else if (match[2] !== undefined) operators.push(decodePdfString(match[2], false));
      else for (const part of match[3].matchAll(/<([0-9A-Fa-f\s]+)>|\(((?:\\.|[^\\)])*)\)/g)) operators.push(decodePdfString(part[1] ?? part[2], Boolean(part[1])));
    }
  }
  return operators.join(" ").replace(/\s+/g, " ").trim();
}

function verifyPdfCache(parsed: ParsedPdfSource, cached: ParsedPdfSource) {
  if (cached.sha256 !== parsed.sha256) throw new Error("Cached extraction source hash does not match PDF bytes");
  for (const page of cached.pages) if (parsed.pages.find(({ page: number, text }) => number === page.page && text === page.text) === undefined) throw new Error(`Cached extraction does not match PDF page ${page.page}`);
  return { ...cached, sourceId: parsed.sourceId, filename: parsed.filename, extraction: "verified_cache" as const };
}

export async function parsePdf(bytes: Uint8Array, options: ParseOptions<ParsedPdfSource>): Promise<ParsedPdfSource> {
  const sha256 = sourceHash(bytes);
  assertHash(sha256, options.expectedSha256);
  if (Buffer.from(bytes).includes(Buffer.from("/Encrypt"))) throw new Error("PASSWORD_PROTECTED: PDF was received but cannot be read");
  let document: PDFDocument;
  try { document = await PDFDocument.load(bytes); }
  catch (cause) {
    if (/encrypt|password/i.test(String(cause))) throw new Error("PASSWORD_PROTECTED: PDF was received but cannot be read", { cause });
    throw new Error("PARSE_FAILED: PDF could not be parsed; no evidence was emitted", { cause });
  }
  const pages = document.getPages().map((_, index) => ({ page: index + 1, text: pageText(document, index) }));
  if (!pages.some(({ text }) => text.length > 0)) throw new Error("OCR_REQUIRED: PDF has no extractable text");
  const parsed: ParsedPdfSource = { kind: "pdf", sourceId: options.sourceId, filename: options.filename, sha256, pages, warnings: [], extraction: "parsed" };
  return options.cachedExtraction ? verifyPdfCache(parsed, options.cachedExtraction) : parsed;
}

function csvRecords(text: string) {
  const records: string[][] = []; let record: string[] = []; let field = ""; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted && character === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (!quoted && character === ",") { record.push(field); field = ""; }
    else if (!quoted && (character === "\n" || character === "\r")) { if (character === "\r" && text[index + 1] === "\n") index += 1; record.push(field); records.push(record); record = []; field = ""; }
    else field += character;
  }
  if (quoted) throw new Error("PARSE_FAILED: CSV contains an unterminated quoted field");
  if (field || record.length) { record.push(field); records.push(record); }
  return records.filter((row) => row.some((value) => value.length));
}

export function parseCsv(bytes: Uint8Array, options: ParseOptions<ParsedCsvSource>): ParsedCsvSource {
  const sha256 = sourceHash(bytes); assertHash(sha256, options.expectedSha256);
  const records = csvRecords(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  if (!records.length || !records[0].length) throw new Error("PARSE_FAILED: CSV has no header row");
  if (new Set(records[0]).size !== records[0].length || records[0].some((header) => !header.trim())) throw new Error("PARSE_FAILED: CSV headers must be non-empty and unique");
  const width = records[0].length;
  if (records.slice(1).some((row) => row.length !== width)) throw new Error("PARSE_FAILED: CSV row width does not match its headers");
  const parsed: ParsedCsvSource = { kind: "csv", sourceId: options.sourceId, filename: options.filename, sha256, headers: records[0], rows: records.slice(1).map((values, index) => ({ row: index + 2, values })), warnings: [], extraction: "parsed" };
  if (!options.cachedExtraction) return parsed;
  if (options.cachedExtraction.sha256 !== sha256 || JSON.stringify(options.cachedExtraction.headers) !== JSON.stringify(parsed.headers) || JSON.stringify(options.cachedExtraction.rows) !== JSON.stringify(parsed.rows)) throw new Error("Cached extraction does not match CSV bytes");
  return { ...options.cachedExtraction, sourceId: options.sourceId, filename: options.filename, extraction: "verified_cache" };
}

export function parseText(bytes: Uint8Array, options: ParseOptions<ParsedTextSource>): ParsedTextSource {
  const sha256 = sourceHash(bytes); assertHash(sha256, options.expectedSha256);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/\r\n?/g, "\n");
  const lines = text.endsWith("\n") ? text.slice(0, -1).split("\n") : text.split("\n");
  const parsed: ParsedTextSource = { kind: "text", sourceId: options.sourceId, filename: options.filename, sha256, lines, warnings: [], extraction: "parsed" };
  if (!options.cachedExtraction) return parsed;
  if (options.cachedExtraction.sha256 !== sha256 || JSON.stringify(options.cachedExtraction.lines) !== JSON.stringify(lines)) throw new Error("Cached extraction does not match TXT bytes");
  return { ...options.cachedExtraction, sourceId: options.sourceId, filename: options.filename, extraction: "verified_cache" };
}

export function validateTextLocator(source: ParsedSource, locator: TextLocator): string {
  if (locator.kind === "pdf_page") {
    if (source.kind !== "pdf") throw new Error("PDF locator requires a PDF source");
    const page = source.pages.find((candidate) => candidate.page === locator.page);
    if (!page || !page.text.includes(locator.excerpt)) throw new Error(`Excerpt does not resolve on PDF page ${locator.page}`);
    return locator.excerpt;
  }
  if (locator.kind === "csv_cell") {
    if (source.kind !== "csv") throw new Error("CSV locator requires a CSV source");
    const column = source.headers.indexOf(locator.column); const row = source.rows.find((candidate) => candidate.row === locator.row);
    if (column < 0 || !row) throw new Error(`CSV locator does not resolve: row ${locator.row}, column ${locator.column}`);
    return row.values[column];
  }
  if (source.kind !== "text") throw new Error("Line locator requires a TXT source");
  if (locator.startLine < 1 || locator.endLine < locator.startLine || locator.endLine > source.lines.length) throw new Error(`TXT line range does not resolve: ${locator.startLine}-${locator.endLine}`);
  return source.lines.slice(locator.startLine - 1, locator.endLine).join("\n");
}

export async function parseSources(inputs: { bytes: Uint8Array; mediaType: string; options: ParseOptions }[]): Promise<ParseResult[]> {
  return Promise.all(inputs.map(async ({ bytes, mediaType, options }) => {
    try {
      const source = mediaType === "application/pdf" ? await parsePdf(bytes, options as ParseOptions<ParsedPdfSource>)
        : mediaType === "text/csv" ? parseCsv(bytes, options as ParseOptions<ParsedCsvSource>)
        : mediaType === "text/plain" ? parseText(bytes, options as ParseOptions<ParsedTextSource>)
        : mediaType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ? await parseWorkbook(bytes, options as ParseWorkbookOptions)
        : null;
      if (!source) return { ok: false, sourceId: options.sourceId, filename: options.filename, reason: "UNSUPPORTED", detail: "File was retained but its type is not supported" } as const;
      return { ok: true, source } as const;
    } catch (cause) {
      const detail = cause instanceof Error ? cause.message : String(cause);
      const reason = (/^(PASSWORD_PROTECTED|OCR_REQUIRED|PARSE_FAILED):/.exec(detail)?.[1] ?? "PARSE_FAILED") as ParseFailureReason;
      return { ok: false, sourceId: options.sourceId, filename: options.filename, reason, detail } as const;
    }
  }));
}
