import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { populatedSampleScenario, visibleDealIds } from "../../src/data/scenarios.ts";
import { demoFixtureSchema } from "../../src/domain/contracts.ts";
import { evaluateCoverage } from "../../src/domain/evaluation.ts";
import { ingestMessage, type InboundEnvelope } from "../../src/domain/ingestion.ts";

const fixture = demoFixtureSchema.parse(JSON.parse(await readFile("fixtures/northstar/demo.json", "utf8")));
const workspace = populatedSampleScenario(fixture);
const digest = (char: string) => `sha256:${char.repeat(64)}`;
const response: InboundEnvelope = {
  source: "SEED", providerMessageId: "failure-1", internetMessageId: "<failure-1@northstar.test>", threadId: fixture.messages[0]!.threadId,
  inReplyTo: fixture.messages[0]!.internetMessageId, from: "james@northstar.test", to: ["priya@acmecapital.test"], cc: [fixture.deal.alias],
  subject: "Re: C-14", sentAt: "2026-09-06T09:00:00Z", receivedAt: "2026-09-06T09:00:01Z", bodyText: "The schedule is attached.", bodyHash: digest("a"), classification: "DILIGENCE_RESPONSE",
};

test("A/R: degraded intake preserves approved state and classifies unsupported or absent files", () => {
  const before = workspace.requests.find(({ id }) => id === "C-14")!.approvedStatus;
  const absent = ingestMessage(workspace, response);
  assert.equal(absent.state, "ACCEPTED");
  if (absent.state === "ACCEPTED") assert.equal(absent.workspace.attachments.length, workspace.attachments.length);
  const unsupported = ingestMessage(workspace, { ...response, providerMessageId: "failure-2", internetMessageId: "<failure-2@northstar.test>", attachments: [{ id: "att-bad", sourceId: "src-bad", filename: "payload.exe", mimeType: "application/octet-stream", sizeBytes: 20_000_000, sha256: digest("b") }] });
  assert.equal(unsupported.state, "ACCEPTED");
  if (unsupported.state === "ACCEPTED") assert.equal(unsupported.workspace.attachments.at(-1)!.processingState, "UNSUPPORTED");
  assert.equal(workspace.requests.find(({ id }) => id === "C-14")!.approvedStatus, before);
});

test("A/R: malformed evaluation uses only a validated fallback and never mutates approved state", () => {
  const request = workspace.requests.find(({ id }) => id === "C-14")!;
  const fallback = { requestId: request.id, assessments: request.items.map((item) => ({ requestItemId: item.id, state: item.id === "C-14.3" ? "SUPPORTED" : "MISSING", sourceIds: item.id === "C-14.3" ? [workspace.evidence[0]!.sourceId] : [], evidenceIds: item.id === "C-14.3" ? [workspace.evidence[0]!.id] : [], reason: item.id === "C-14.3" ? "Validated source" : "No source" })) };
  const result = evaluateCoverage(workspace, { requestId: request.id, assessments: [] }, { fallback });
  assert.equal(result.state, "PREPARED_FALLBACK");
  assert.equal(result.proposal?.supportedItems.length, 1);
  assert.equal(request.approvedStatus, workspace.requests.find(({ id }) => id === request.id)!.approvedStatus);
});

test("O9: an organisation member without active deal access resolves no deal IDs", () => {
  const memberOnly = { ...workspace, users: [...workspace.users, { id: "user_alex", name: "Alex Morgan", email: "alex@acmecapital.test" }], memberships: [...workspace.memberships, { id: "membership_alex", organisationId: fixture.organisation.id, userId: "user_alex", role: "MEMBER" as const, state: "ACTIVE" as const }] };
  assert.deepEqual(visibleDealIds(memberOnly, "user_alex"), []);
  assert.deepEqual(visibleDealIds(memberOnly, "user_priya"), [fixture.deal.id]);
});
