import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { PDFDocument } from "pdf-lib";
import { parseCsv, parsePdf, parseSources, parseText, validateTextLocator } from "../../src/domain/parsing.ts";

const fixture = (name: string) => readFile(path.join(process.cwd(), "fixtures/northstar", name));

test("extracts PDF pages and validates an exact page excerpt", async () => {
  const source = await parsePdf(await fixture("Northstar_IC_Memo.pdf"), { sourceId: "memo", filename: "Northstar_IC_Memo.pdf" });
  assert.equal(source.pages.length, 2);
  assert.equal(validateTextLocator(source, { kind: "pdf_page", page: 2, excerpt: "Largest customer represented 22% of FY25 revenue." }), "Largest customer represented 22% of FY25 revenue.");
  assert.throws(() => validateTextLocator(source, { kind: "pdf_page", page: 1, excerpt: "22%" }), /does not resolve/);
});

test("addresses CSV values by source row and header without inventing a missing period", async () => {
  const source = parseCsv(await fixture("Customer_Revenue_FY26.csv"), { sourceId: "customer-csv", filename: "Customer_Revenue_FY26.csv" });
  assert.deepEqual(source.headers, ["Rank", "Customer", "Share of FY26 revenue"]);
  assert.equal(validateTextLocator(source, { kind: "csv_cell", row: 2, column: "Share of FY26 revenue" }), "31%");
  assert.equal(source.headers.some((header) => /FY25/i.test(header)), false);
  assert.throws(() => validateTextLocator(source, { kind: "csv_cell", row: 2, column: "Share of FY25 revenue" }), /does not resolve/);
});

test("preserves TXT line boundaries and validates inclusive line ranges", async () => {
  const source = parseText(await fixture("Management_Response.txt"), { sourceId: "response", filename: "Management_Response.txt" });
  assert.equal(validateTextLocator(source, { kind: "text_lines", startLine: 2, endLine: 3 }), "FY26 customer revenue schedule is attached.\nThe schedule covers FY26 only.");
  assert.throws(() => validateTextLocator(source, { kind: "text_lines", startLine: 0, endLine: 2 }), /does not resolve/);
});

test("keeps successful results while classifying unreadable and unsupported files", async () => {
  const scanned = await PDFDocument.create(); scanned.addPage();
  const results = await parseSources([
    { bytes: await fixture("Customer_Revenue_FY26.csv"), mediaType: "text/csv", options: { sourceId: "csv", filename: "Customer_Revenue_FY26.csv" } },
    { bytes: await scanned.save(), mediaType: "application/pdf", options: { sourceId: "scan", filename: "scan.pdf" } },
    { bytes: new TextEncoder().encode("%PDF-1.7\n/Encrypt"), mediaType: "application/pdf", options: { sourceId: "locked", filename: "locked.pdf" } },
    { bytes: new Uint8Array([80, 75, 3, 4]), mediaType: "application/zip", options: { sourceId: "zip", filename: "bundle.zip" } },
  ]);
  assert.deepEqual(results.map((result) => result.ok ? "PARSED" : result.reason), ["PARSED", "OCR_REQUIRED", "PASSWORD_PROTECTED", "UNSUPPORTED"]);
});

test("accepts only source-hash-matched, byte-validated caches", async () => {
  const bytes = await fixture("Customer_Revenue_FY26.csv");
  const parsed = parseCsv(bytes, { sourceId: "csv", filename: "Customer_Revenue_FY26.csv" });
  const cached = parseCsv(bytes, { sourceId: "new-id", filename: "renamed.csv", cachedExtraction: parsed });
  assert.equal(cached.extraction, "verified_cache");
  assert.throws(() => parseCsv(new TextEncoder().encode("A\nchanged"), { sourceId: "csv", filename: "changed.csv", cachedExtraction: parsed }), /does not match CSV bytes/);
});
