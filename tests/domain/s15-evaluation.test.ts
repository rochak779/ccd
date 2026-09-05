import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { demoFixtureSchema } from "../../src/domain/contracts.ts";
import { populatedSampleScenario } from "../../src/data/scenarios.ts";
import { evaluateCoverage, percentagePointDelta } from "../../src/domain/evaluation.ts";

const load = async () => populatedSampleScenario(demoFixtureSchema.parse(JSON.parse(await readFile(path.join(process.cwd(), "fixtures/northstar/demo.json"), "utf8"))));
const firstReply = {
  requestId: "C-14",
  assessments: [
    { requestItemId: "C-14.1", state: "MISSING", sourceIds: ["msg_first_reply"], evidenceIds: [], reason: "Contracts promised, not supplied." },
    { requestItemId: "C-14.2", state: "MISSING", sourceIds: ["msg_first_reply"], evidenceIds: [], reason: "FY25 schedule absent." },
    { requestItemId: "C-14.3", state: "SUPPORTED", sourceIds: ["src_customer_fy26"], evidenceIds: ["ev_fy26_schedule"], reason: "FY26 schedule supplied." },
    { requestItemId: "C-14.4", state: "MISSING", sourceIds: ["msg_first_reply"], evidenceIds: [], reason: "Expiry schedule absent." },
  ],
};

test("first reply yields 1/4 supported, an unchanged approved state and nine-point potential conflict", async () => {
  const workspace = await load(); const result = evaluateCoverage(workspace, firstReply);
  assert.equal(result.state, "READY"); assert.deepEqual(result.proposal?.supportedItems, ["C-14.3"]);
  assert.equal(result.proposal?.missingItems.length, 3); assert.equal(result.proposal?.previousStatus, "AWAITING_RESPONSE");
  assert.equal(workspace.requests[0].approvedStatus, "AWAITING_RESPONSE");
  assert.match(result.findings.find(({ type }) => type === "POTENTIAL_CONFLICT")!.reason, /9 percentage points/);
});

test("invalid output cannot imply support and a validated prepared fallback is explicit", async () => {
  const workspace = await load();
  const invented = structuredClone(firstReply); invented.assessments[2].evidenceIds = ["made_up"];
  assert.equal(evaluateCoverage(workspace, invented).state, "INVALID_OUTPUT");
  assert.equal(evaluateCoverage(workspace, invented, { fallback: firstReply }).state, "PREPARED_FALLBACK");
  assert.equal(evaluateCoverage(workspace, null, { retryable: true }).state, "RETRYABLE_FAILURE");
});

test("period differences alone and fully supported controls manufacture no conflict", async () => {
  const workspace = await load(); workspace.messages.find(({ id }) => id === "msg_first_reply")!.bodyText = "Please see the FY26 schedule.";
  const allSupported = { ...firstReply, assessments: firstReply.assessments.map((entry) => ({ ...entry, state: "SUPPORTED", sourceIds: ["src_customer_fy26"], evidenceIds: ["ev_fy26_schedule"] })) };
  const controlEvidence = workspace.evidence[0]; workspace.evidence = firstReply.assessments.map((entry, index) => ({ ...controlEvidence, id: `control_${index}`, supportsRequestItemId: entry.requestItemId }));
  allSupported.assessments.forEach((entry, index) => { entry.evidenceIds = [`control_${index}`]; });
  const result = evaluateCoverage(workspace, allSupported);
  assert.equal(result.proposal?.proposedStatus, "READY_TO_COMPLETE"); assert.equal(result.findings.length, 0);
  assert.equal(percentagePointDelta({ rawValue: .22, unit: "PERCENT" }, { rawValue: .31, unit: "PERCENT" }), 9);
  assert.equal(percentagePointDelta({ rawValue: 10, unit: "GBP" }, { rawValue: 11, unit: "GBP" }), null);
});
