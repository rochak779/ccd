import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evidenceChain, verifyWorkspaceAudit } from "../../src/audit/index.ts";
import { decideConflict, decideProposal, correctEvidence, DomainRuleError, escalateFinding, executeCommand, executeIdempotentCommand } from "../../src/domain/commands.ts";
import { demoFixtureSchema } from "../../src/domain/contracts.ts";
import { populatedSampleScenario } from "../../src/data/scenarios.ts";
import type { CommitResult, LoadResult, Workspace, WorkspaceRepository } from "../../src/data/repository.ts";

class MemoryRepository implements WorkspaceRepository {
  public workspace: Workspace;
  private readonly fail: boolean;
  constructor(workspace: Workspace, fail = false) { this.workspace = workspace; this.fail = fail; }
  async load(): Promise<LoadResult> { return { state: "READY", workspace: structuredClone(this.workspace) }; }
  async commit(expectedRevision: number, workspace: Workspace): Promise<CommitResult> {
    if (this.fail) return { state: "ERROR", error: new Error("write failed") };
    if (expectedRevision !== this.workspace.revision) return { state: "CONFLICT", actualRevision: this.workspace.revision };
    this.workspace = structuredClone(workspace); return { state: "SAVED", workspace: this.workspace };
  }
  async reset(workspace: Workspace): Promise<CommitResult> { this.workspace = structuredClone(workspace); return { state: "SAVED", workspace: this.workspace }; }
}
const at = "2026-09-06T10:00:00.000Z";
const actor = { id: "user_priya", type: "USER" as const };
const sample = async () => populatedSampleScenario(demoFixtureSchema.parse(JSON.parse(await readFile("fixtures/northstar/demo.json", "utf8"))));

test("T6/H1/U8: approval is atomic, replay-safe and stale-safe; rejection never changes tracker state", async () => {
  const repository = new MemoryRepository(await sample());
  const approve = decideProposal({ proposalId: "proposal_501", commandId: "approve-1", actorId: actor.id, action: "APPROVE", decidedAt: at });
  assert.equal((await executeIdempotentCommand(repository, 0, actor, "approve-1", approve, () => new Date(at))).state, "SAVED");
  assert.equal(repository.workspace.requests[0]?.approvedStatus, "PARTIAL_EVIDENCE_MISSING");
  assert.equal(repository.workspace.proposals[0]?.proposalState, "RECORDED");
  assert.equal(repository.workspace.decisions.length, 1); assert.equal(repository.workspace.audit.length, 1);
  assert.equal((await executeIdempotentCommand(repository, 0, actor, "approve-1", approve)).state, "SAVED");
  assert.equal(repository.workspace.decisions.length, 1); assert.equal(repository.workspace.audit.length, 1);
  assert.deepEqual(await executeIdempotentCommand(repository, 0, actor, "other", approve), { state: "CONFLICT", actualRevision: 1 });

  const rejected = new MemoryRepository(await sample());
  await executeIdempotentCommand(rejected, 0, actor, "reject-1", decideProposal({ proposalId: "proposal_501", commandId: "reject-1", actorId: actor.id, action: "REJECT", reason: "Need corrected support", decidedAt: at }));
  assert.equal(rejected.workspace.requests[0]?.approvedStatus, "AWAITING_RESPONSE");
  const failed = new MemoryRepository(await sample(), true);
  assert.equal((await executeIdempotentCommand(failed, 0, actor, "approve-fail", decideProposal({ proposalId: "proposal_501", commandId: "approve-fail", actorId: actor.id, action: "APPROVE", decidedAt: at }))).state, "ERROR");
  assert.equal(failed.workspace.decisions.length, 0); assert.equal(failed.workspace.audit.length, 0);
});

test("H2-H3: reasons, local escalation and corrections preserve history while invalidating dependent proposals", async () => {
  const base = await sample();
  assert.throws(() => decideProposal({ proposalId: "proposal_501", commandId: "override", actorId: actor.id, action: "OVERRIDE_COMPLETE", reason: " ", decidedAt: at })(base), DomainRuleError);
  assert.throws(() => decideConflict({ findingId: "finding_009", commandId: "dismiss", actorId: actor.id, decision: "DISMISS_CONFLICT", reason: "", decidedAt: at })(base), DomainRuleError);
  const approved = decideProposal({ proposalId: "proposal_501", commandId: "approve", actorId: actor.id, action: "APPROVE", decidedAt: at })(base).workspace;
  const corrected = correctEvidence({ evidenceId: "ev_fy26_schedule", correctionId: "correction-1", actorId: actor.id, correctedAt: at, patch: { relevance: "UNRELATED", period: "FY25" } })(approved).workspace;
  assert.equal(corrected.decisions.length, 1); assert.equal(corrected.requests[0]?.approvedStatus, "PARTIAL_EVIDENCE_MISSING");
  assert.equal(corrected.evidence[0]?.relevance, "UNRELATED"); assert.equal(corrected.corrections[0]?.before.relevance, "RELEVANT");
  assert.equal(corrected.proposals[0]?.proposalState, "RECORDED");
  assert.deepEqual(corrected.proposals.at(-1)?.missingItems, ["C-14.1", "C-14.2", "C-14.3", "C-14.4"]);
  const withLead: Workspace = { ...base, dealAccess: base.dealAccess.map((access) => ({ ...access, role: "DEAL_LEAD" as const })) };
  const escalated = escalateFinding({ findingId: "finding_009", escalationId: "esc-1", actorId: actor.id, assignedToUserId: "user_priya", reason: "Lead review needed", createdAt: at })(withLead).workspace;
  assert.match(escalated.escalations[0]!.internalHref, /finding_009$/); assert.equal(escalated.escalations.length, 1);
});

test("U9-U10: stored relationships project to navigable lineage and audit verification reports precise tampering", async () => {
  const repository = new MemoryRepository(await sample());
  await executeCommand(repository, 0, actor, decideProposal({ proposalId: "proposal_501", commandId: "approve", actorId: actor.id, action: "APPROVE", decidedAt: at }), () => new Date(at));
  const nodes = evidenceChain(repository.workspace, "finding_009");
  assert(nodes.some(({ kind, id }) => kind === "request" && id === "C-14"));
  assert(nodes.some(({ kind, id }) => kind === "evidence" && id === "ev_fy26_schedule"));
  assert(nodes.some(({ kind }) => kind === "decision"));
  assert.deepEqual(await verifyWorkspaceAudit(repository.workspace), { eventCount: 1, result: { valid: true } });
  repository.workspace.audit[0]!.after = { altered: true };
  assert.deepEqual(await verifyWorkspaceAudit(repository.workspace), { eventCount: 1, result: { valid: false, sequence: 1 } });
});

test("S21: completion and explanation acceptance are independent; keep-open and unusable evidence prevent completion", async () => {
  const base = await sample(); const request = base.requests[0]!;
  const completeProposal = { ...base.proposals[0]!, id: "proposal_complete", previousStatus: "PARTIAL_EVIDENCE_MISSING", proposedStatus: "READY_TO_COMPLETE" as const, supportedItems: request.items.map(({ id }) => id), missingItems: [] };
  const ready: Workspace = { ...base, requests: [{ ...request, approvedStatus: "PARTIAL_EVIDENCE_MISSING" }], proposals: [completeProposal] };
  const kept = decideProposal({ proposalId: completeProposal.id, commandId: "keep", actorId: actor.id, action: "KEEP_OPEN", reason: "Need final review", decidedAt: at })(ready).workspace;
  assert.equal(kept.requests[0]?.approvedStatus, "PARTIAL_EVIDENCE_MISSING"); assert.equal(kept.findings[0]?.state, "OPEN");
  const completed = decideProposal({ proposalId: completeProposal.id, commandId: "complete", actorId: actor.id, action: "CONFIRM_COMPLETE", decidedAt: at })(ready).workspace;
  assert.equal(completed.requests[0]?.approvedStatus, "COMPLETE"); assert.equal(completed.findings[0]?.state, "OPEN", "an explanation alone is not accepted");
  const accepted = decideConflict({ findingId: "finding_009", commandId: "accept", actorId: actor.id, decision: "ACCEPT_EXPLANATION", reason: "Revised contracts explain the movement", decidedAt: at })(completed).workspace;
  assert.equal(accepted.findings[0]?.state, "DISMISSED"); assert.equal(accepted.decisions.at(-1)?.action, "ACCEPT_EXPLANATION");
  const unreadable: Workspace = { ...ready, attachments: ready.attachments.map((attachment) => ({ ...attachment, processingState: "UNREADABLE" as const })) };
  assert.throws(() => decideProposal({ proposalId: completeProposal.id, commandId: "bad", actorId: actor.id, action: "CONFIRM_COMPLETE", decidedAt: at })(unreadable), /Unreadable/);
  assert.equal(base.decisions.length, 0, "historical input is never mutated");
});
