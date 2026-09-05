import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { demoFixtureSchema } from "../../src/domain/contracts.ts";
import { ingestMessage, type InboundEnvelope, type RequestExtraction } from "../../src/domain/ingestion.ts";
import { populatedSampleScenario } from "../../src/data/scenarios.ts";

const fixture = demoFixtureSchema.parse(JSON.parse(await readFile("fixtures/northstar/demo.json", "utf8")));
const clean = () => ({ ...populatedSampleScenario(fixture), revision: 0, messages: [], attachments: [], requests: [], evidence: [], findings: [], proposals: [], decisions: [], sources: fixture.sources.filter((source) => !source.id.includes("customer_fy26")), audit: [] });
const digest = (char: string) => `sha256:${char.repeat(64)}`;
const request: InboundEnvelope = { source: "SEED", providerMessageId: "req-new", internetMessageId: "<request-new@acmecapital.test>", threadId: "thread-c14", inReplyTo: null, references: [], from: "priya@acmecapital.test", to: ["james@northstar.test"], cc: [fixture.deal.alias], subject: "Northstar — customer concentration information", sentAt: "2026-09-02T09:12:00Z", receivedAt: "2026-09-02T09:12:02Z", bodyText: "Please provide the customer information.", bodyHash: digest("1"), classification: "DILIGENCE_REQUEST" };
const extraction: RequestExtraction = { messageType: "DILIGENCE_REQUEST", title: "Customer concentration information", confidence: .95, requestedItems: [
  { label: "Top ten customer contracts", evidenceType: "CONTRACT", period: null, required: true },
  { label: "Revenue by customer FY25", evidenceType: "FINANCIAL_SCHEDULE", period: "FY25", required: true },
  { label: "Revenue by customer FY26", evidenceType: "FINANCIAL_SCHEDULE", period: "FY26", required: true },
  { label: "Current contract expiry dates", evidenceType: "EXPIRY_SCHEDULE", period: null, required: true },
] };

test("R1/T1/U2 routes an authorised request and creates one four-item request", () => {
  const result = ingestMessage(clean(), request, extraction); assert.equal(result.state, "ACCEPTED"); if (result.state !== "ACCEPTED") return;
  assert.equal(result.dealId, "deal_northstar"); assert.equal(result.workspace.requests.length, 1); assert.deepEqual(result.workspace.requests[0].items.map(({ id }) => id), ["C-14.1", "C-14.2", "C-14.3", "C-14.4"]);
  assert.deepEqual(result.workspace.requests[0].extraction, { sourceMessageId: result.messageId, confidence: .95 });
});

test("R2-R5 enforce alias, sender, cross-deal and replay boundaries", () => {
  const atlas = { ...fixture.deal, id: "deal_atlas", name: "Atlas", alias: "atlas@inbound.ccd.test" };
  const base = { ...clean(), deals: [...clean().deals, atlas] };
  const atlasResult = ingestMessage(base, { ...request, providerMessageId: "atlas-1", internetMessageId: "<atlas-1@test>", cc: [atlas.alias] }, extraction); assert.equal(atlasResult.state, "ACCEPTED"); if (atlasResult.state === "ACCEPTED") assert.equal(atlasResult.dealId, atlas.id);
  assert.deepEqual(ingestMessage(base, { ...request, cc: ["unknown@inbound.ccd.test"] }, extraction).state, "QUARANTINED");
  assert.deepEqual(ingestMessage(base, { ...request, from: "intruder@unknown.test" }, extraction).state, "QUARANTINED");
  const first = ingestMessage(base, request, extraction); assert.equal(first.state, "ACCEPTED"); if (first.state !== "ACCEPTED") return;
  const replay = ingestMessage(first.workspace, request, extraction); assert.equal(replay.state, "DUPLICATE"); assert.equal(replay.workspace.messages.length, first.workspace.messages.length);
  const mismatch = ingestMessage({ ...first.workspace, deals: [...first.workspace.deals, atlas] }, { ...request, providerMessageId: "cross", internetMessageId: "<cross@test>", inReplyTo: request.internetMessageId, cc: [atlas.alias], from: "james@northstar.test", classification: "DILIGENCE_RESPONSE" }); assert.deepEqual(mismatch.state, "QUARANTINED");
});

test("T2/U3 stores body and attachment separately and matches reply deterministically", () => {
  const created = ingestMessage(clean(), request, extraction); assert.equal(created.state, "ACCEPTED"); if (created.state !== "ACCEPTED") return;
  const reply = ingestMessage(created.workspace, { ...request, providerMessageId: "reply-new", internetMessageId: "<reply-new@northstar.test>", inReplyTo: request.internetMessageId, from: "james@northstar.test", to: ["priya@acmecapital.test"], subject: `Re: ${request.subject}`, bodyHash: digest("2"), classification: "DILIGENCE_RESPONSE", attachments: [{ id: "att-fy26", sourceId: "src-fy26", filename: "../Customer_Revenue_FY26.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", sizeBytes: 6816, sha256: digest("3") }] });
  assert.equal(reply.state, "ACCEPTED"); if (reply.state !== "ACCEPTED") return; assert.deepEqual(reply.match, { state: "MATCHED", requestId: "C-14", basis: "IN_REPLY_TO" });
  assert.equal(reply.workspace.sources.length, created.workspace.sources.length + 2); assert.equal(reply.workspace.attachments[0].filename, "_Customer_Revenue_FY26.xlsx");
});

test("imported C-14 reconciles and ambiguous explicit IDs stay suggestions", () => {
  const imported = { ...clean(), requests: [fixture.requests[0]] };
  const linked = ingestMessage(imported, request, extraction); assert.equal(linked.state, "ACCEPTED"); if (linked.state !== "ACCEPTED") return; assert.equal(linked.workspace.requests.length, 1); assert.equal(linked.workspace.requests[0].sourceMessageId, linked.messageId);
  const second = { ...linked.workspace, requests: [...linked.workspace.requests, { ...linked.workspace.requests[0], id: "C-15", sourceMessageId: "unmatched" }] };
  const response = ingestMessage(second, { ...request, providerMessageId: "ambiguous", internetMessageId: "<ambiguous@test>", threadId: "new-thread", from: "james@northstar.test", classification: "DILIGENCE_RESPONSE", bodyText: "Regarding C-14 and C-15", bodyHash: digest("4") });
  assert.equal(response.state, "ACCEPTED"); if (response.state === "ACCEPTED") assert.deepEqual(response.match, { state: "SUGGESTED", requestIds: ["C-14", "C-15"], reason: "EXPLICIT_ID" });
});
