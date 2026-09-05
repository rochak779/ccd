import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import ExcelJS from "exceljs";
import { PDFDocument } from "pdf-lib";
import { demoFixtureSchema, type DemoFixture } from "../../src/domain/contracts.ts";

const root = path.join(process.cwd(), "fixtures/northstar");
const load = async (): Promise<DemoFixture> => demoFixtureSchema.parse(JSON.parse(await readFile(path.join(root, "demo.json"), "utf8")));

async function validateReferences(fixture: DemoFixture) {
  const sourceIds = new Set(fixture.sources.map(({ id }) => id));
  const itemIds = new Set(fixture.requests.flatMap(({ items }) => items.map(({ id }) => id)));
  for (const claim of fixture.baselineClaims) assert(sourceIds.has(claim.sourceId), `Unknown source ${claim.sourceId}`);
  for (const evidence of fixture.evidence) {
    assert(sourceIds.has(evidence.sourceId), `Unknown source ${evidence.sourceId}`);
    assert(itemIds.has(evidence.supportsRequestItemId), `Unknown request item ${evidence.supportsRequestItemId}`);
    if (evidence.locator.kind === "spreadsheet_range") {
      const source = fixture.sources.find(({ id }) => id === evidence.sourceId)!;
      const book = new ExcelJS.Workbook(); await book.xlsx.readFile(path.join(root, source.filename));
      const sheet = book.getWorksheet(evidence.locator.sheet);
      assert(sheet && sheet.getCell(evidence.locator.range.split(":")[0]).value !== null, "Invalid spreadsheet locator");
    }
  }
}

test("canonical source pack is inspectable and internally consistent", async () => {
  const fixture = await load(); await validateReferences(fixture);
  const customer = new ExcelJS.Workbook(); await customer.xlsx.readFile(path.join(root, "Customer_Revenue_FY26.xlsx"));
  assert.equal(customer.getWorksheet("Customer Summary")?.getCell("C3").value, 0.31);
  const tracker = new ExcelJS.Workbook(); await tracker.xlsx.readFile(path.join(root, "Northstar_Diligence_Tracker.xlsx"));
  assert.equal(tracker.getWorksheet("Requests")?.getCell("A2").value, "C-14");
  assert.equal(fixture.requests[0].items.length, 4); assert.equal(fixture.evidence.length, 1);
  const pdf = await PDFDocument.load(await readFile(path.join(root, "Northstar_IC_Memo.pdf")));
  assert.equal(pdf.getPageCount(), 2); assert.equal(fixture.baselineClaims[0].rawValue, 0.22);
});

test("missing sources, invalid locators and unknown request items fail validation", async () => {
  const fixture = await load();
  await assert.rejects(validateReferences({ ...fixture, evidence: [{ ...fixture.evidence[0], sourceId: "missing" }] }), /Unknown source/);
  await assert.rejects(validateReferences({ ...fixture, evidence: [{ ...fixture.evidence[0], supportsRequestItemId: "C-14.99" }] }), /Unknown request item/);
  await assert.rejects(validateReferences({ ...fixture, evidence: [{ ...fixture.evidence[0], locator: { kind: "spreadsheet_range", sheet: "Missing", range: "A1:B2" } }] }), /Invalid spreadsheet locator/);
});
