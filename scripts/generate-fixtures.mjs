import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";
import { PDFDocument, StandardFonts } from "pdf-lib";

const root = path.join(process.cwd(), "fixtures/northstar");
const hash = (value) => `sha256:${createHash("sha256").update(value).digest("hex")}`;

async function workbook(filename, sheetName, rows, formats = {}) {
  const book = new ExcelJS.Workbook();
  const fixtureDate = new Date("2026-09-05T00:00:00Z");
  book.created = fixtureDate; book.modified = fixtureDate; book.lastPrinted = fixtureDate;
  const sheet = book.addWorksheet(sheetName);
  sheet.addRows(rows);
  for (const [cell, format] of Object.entries(formats)) sheet.getCell(cell).numFmt = format;
  await book.xlsx.writeFile(path.join(root, filename));
}

const pdf = await PDFDocument.create();
pdf.setCreationDate(new Date("2026-09-05T00:00:00Z"));
pdf.setModificationDate(new Date("2026-09-05T00:00:00Z"));
const font = await pdf.embedFont(StandardFonts.Helvetica);
for (const [heading, body] of [["Project Northstar — IC memo", "Synthetic investment committee reference."], ["Customer concentration", "Largest customer represented 22% of FY25 revenue."]]) {
  const page = pdf.addPage([595, 842]);
  page.drawText(heading, { x: 64, y: 760, size: 20, font });
  page.drawText(body, { x: 64, y: 710, size: 12, font });
}
await writeFile(path.join(root, "Northstar_IC_Memo.pdf"), await pdf.save());
await workbook("Northstar_Diligence_Tracker.xlsx", "Requests", [["ID", "Request", "Contracts", "FY25 revenue", "FY26 revenue", "Expiry dates"], ["C-14", "Customer concentration information", "Required", "Required", "Required", "Required"]]);
await workbook("Customer_Revenue_FY26.xlsx", "Customer Summary", [["Rank", "Customer", "Share of FY26 revenue"], ["Observation", "Largest-customer concentration", 0.31], [1, "Aster Group", 0.31], [2, "Beacon Ltd", 0.14], [3, "Cobalt plc", 0.11], [4, "Dovetail SA", 0.09], [5, "Elm GmbH", 0.08], [6, "Fjord BV", 0.07], [7, "Granite Inc", 0.06], [8, "Harbour Co", 0.05], [9, "Ion SAS", 0.04], [10, "Juniper Ltd", 0.03]], { C3: "0%", C4: "0%", C5: "0%", C6: "0%", C7: "0%", C8: "0%", C9: "0%", C10: "0%", C11: "0%", C12: "0%" });

const demoPath = path.join(root, "demo.json");
const demo = JSON.parse(await readFile(demoPath, "utf8"));
const files = ["Northstar_IC_Memo.pdf", "Northstar_Diligence_Tracker.xlsx", "Customer_Revenue_FY26.xlsx"];
demo.sources = await Promise.all(files.map(async (filename, i) => ({ id: ["src_ic_memo", "src_tracker", "src_customer_fy26"][i], dealId: "deal_northstar", filename, mediaType: filename.endsWith(".pdf") ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sha256: hash(await readFile(path.join(root, filename))), versionState: "CURRENT" })));
demo.baselineClaims = [{ id: "claim_fy25_22", sourceId: "src_ic_memo", state: "CONFIRMED", subject: "Largest-customer concentration", period: "FY25", rawValue: 0.22, displayValue: "22%", unit: "PERCENT", locator: { kind: "pdf_page", page: 2, excerpt: "Largest customer represented 22% of FY25 revenue." } }];
const messageRows = [
  ["msg_request", "req-089", "<request@acmecapital.test>", null, "priya@acmecapital.test", "james@northstar.test", "Northstar — customer concentration information", "2026-09-02T09:12:00Z", "Please provide top ten customer contracts, revenue by customer for FY25 and FY26, and current contract expiry dates.", [], "DILIGENCE_REQUEST"],
  ["msg_first_reply", "reply-103", "<reply-103@northstar.test>", "<request@acmecapital.test>", "james@northstar.test", "priya@acmecapital.test", "Re: Northstar — customer concentration information", "2026-09-05T09:42:00Z", "Please see the FY26 schedule. Customer concentration remains stable. Contracts and expiry dates are still being compiled.", ["att_customer_fy26"], "DILIGENCE_RESPONSE"],
  ["msg_control_reply", "reply-104", "<reply-104@northstar.test>", "<insurance-request@acmecapital.test>", "james@northstar.test", "priya@acmecapital.test", "Re: Insurance renewal details", "2026-09-05T10:05:00Z", "The current insurer is Northstar Mutual and the renewal date is 30 June 2027. This answers both requested items.", [], "DILIGENCE_RESPONSE"],
  ["msg_noise", "noise-105", "<noise-105@northstar.test>", null, "james@northstar.test", "priya@acmecapital.test", "Tuesday meeting", "2026-09-05T10:20:00Z", "Can we move Tuesday's call to 14:00 BST?", [], "SCHEDULING_NOISE"]
];
demo.messages = messageRows.map(([id, providerMessageId, internetMessageId, inReplyTo, from, to, subject, sentAt, bodyText, attachmentIds, classification]) => ({ id, dealId: "deal_northstar", source: "SEED", providerMessageId, internetMessageId, threadId: id === "msg_noise" ? "thread_noise" : id === "msg_control_reply" ? "thread_control" : "thread_c14", inReplyTo, from, to: [to], cc: ["northstar@inbound.ccd.test"], subject, sentAt, bodyText, bodyHash: hash(bodyText), attachmentIds, classification }));
const customerBytes = await readFile(path.join(root, "Customer_Revenue_FY26.xlsx"));
demo.attachments = [{ id: "att_customer_fy26", messageId: "msg_first_reply", sourceId: "src_customer_fy26", filename: "Customer_Revenue_FY26.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sizeBytes: customerBytes.length, sha256: hash(customerBytes), processingState: "PARSED", parseWarnings: [], evidenceIds: ["ev_fy26_schedule"] }];
demo.evidence = [{ id: "ev_fy26_schedule", dealId: "deal_northstar", sourceId: "src_customer_fy26", attachmentId: "att_customer_fy26", supportsRequestItemId: "C-14.3", locator: { kind: "spreadsheet_range", sheet: "Customer Summary", range: "A2:C12" }, displayValue: "FY26 customer revenue schedule; largest customer 31%", rawValue: 0.31, confidence: 0.97 }];
demo.findings = [{ id: "finding_009", dealId: "deal_northstar", type: "POTENTIAL_CONFLICT", state: "OPEN", suggestedSeverity: "HIGH", confirmedSeverity: null, sourceIds: ["src_ic_memo", "src_customer_fy26", "msg_first_reply"], reason: "Management describes concentration as stable while comparable FY25 and FY26 observations increased from 22% to 31%." }];
demo.proposals = [{ id: "proposal_501", requestId: "C-14", previousStatus: "AWAITING_RESPONSE", proposedStatus: "PARTIAL_EVIDENCE_MISSING", proposalState: "READY", supportedItems: ["C-14.3"], missingItems: ["C-14.1", "C-14.2", "C-14.4"], findingIds: ["finding_009"], requiresHumanApproval: true }];
await writeFile(demoPath, `${JSON.stringify(demo, null, 2)}\n`);
console.log("Generated Northstar PDF/XLSX sources and normalised demo envelopes.");
