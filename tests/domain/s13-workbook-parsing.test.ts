import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import ExcelJS from "exceljs";
import { parseWorkbook, validateWorkbookLocator } from "../../src/domain/parsing.ts";

const fixturePath = path.join(process.cwd(), "fixtures/northstar/Customer_Revenue_FY26.xlsx");

test("parses the FY26 schedule with raw, displayed and addressable cell evidence", async () => {
  const parsed = await parseWorkbook(await readFile(fixturePath), { sourceId: "src_customer_fy26", filename: "Customer_Revenue_FY26.xlsx" });
  const sheet = parsed.sheets.find(({ name }) => name === "Customer Summary");
  assert.equal(sheet?.populatedRange, "A1:C12");
  assert.deepEqual(sheet?.tables[0].headers, ["Rank", "Customer", "Share of FY26 revenue"]);
  assert.equal(sheet?.tables[0].period, "FY26");
  assert.equal(sheet?.tables[0].unit, "percentage_of_revenue");
  const [observation] = validateWorkbookLocator(parsed, { kind: "spreadsheet_cell", sheet: "Customer Summary", cell: "C3" });
  assert.equal(observation.rawValue, 0.31);
  assert.equal(observation.displayValue, "31%");
  assert.equal(validateWorkbookLocator(parsed, { kind: "spreadsheet_range", sheet: "Customer Summary", range: "A2:C12" }).length, 33);
});

test("preserves formula provenance without calculating unresolved formulas", async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Formula checks");
  sheet.getCell("A1").value = "Metric";
  sheet.getCell("A2").value = { formula: "1+1", result: 2 };
  sheet.getCell("A3").value = { formula: "2+2" };
  const parsed = await parseWorkbook(await workbook.xlsx.writeBuffer() as unknown as Uint8Array, { sourceId: "formula_source", filename: "formulas.xlsx" });
  const cached = validateWorkbookLocator(parsed, { kind: "spreadsheet_cell", sheet: "Formula checks", cell: "A2" })[0];
  const unresolved = validateWorkbookLocator(parsed, { kind: "spreadsheet_cell", sheet: "Formula checks", cell: "A3" })[0];
  assert.deepEqual({ formula: cached.formula, raw: cached.rawValue, cached: cached.cachedFormulaResult }, { formula: "1+1", raw: 2, cached: true });
  assert.deepEqual({ formula: unresolved.formula, raw: unresolved.rawValue, display: unresolved.displayValue }, { formula: "2+2", raw: null, display: null });
  assert.match(parsed.warnings.join("\n"), /Formula has no cached result/);
});

test("rejects invalid locators, corrupt files and unverified cached extraction", async () => {
  const bytes = await readFile(fixturePath);
  const parsed = await parseWorkbook(bytes, { sourceId: "source", filename: "Customer_Revenue_FY26.xlsx" });
  assert.throws(() => validateWorkbookLocator(parsed, { kind: "spreadsheet_cell", sheet: "Missing", cell: "C3" }), /Unknown workbook sheet/);
  assert.throws(() => validateWorkbookLocator(parsed, { kind: "spreadsheet_cell", sheet: "Customer Summary", cell: "C0" }), /Invalid cell reference/);
  await assert.rejects(parseWorkbook(new Uint8Array([1, 2, 3]), { sourceId: "bad", filename: "bad.xlsx" }), /no evidence was emitted/);
  await assert.rejects(parseWorkbook(bytes, {
    sourceId: "source", filename: "Customer_Revenue_FY26.xlsx",
    cachedExtraction: { ...parsed, sha256: `sha256:${"0".repeat(64)}` },
  }), /source hash does not match/);
  const wrongCell = { ...parsed.sheets[0].cells.find(({ address }) => address === "C3")!, rawValue: 0.99 };
  await assert.rejects(parseWorkbook(bytes, {
    sourceId: "source", filename: "Customer_Revenue_FY26.xlsx",
    cachedExtraction: { ...parsed, sheets: [{ ...parsed.sheets[0], cells: [wrongCell] }] },
  }), /does not match Customer Summary!C3/);
});
