import { appendAuditEvent } from "../audit/index.ts";
import type { CommitResult, Workspace, WorkspaceRepository } from "../data/repository.ts";
import type { z } from "zod";
import { locatorSchema } from "./contracts.ts";

export type CommandActor = { id: string; type: "USER" | "SYSTEM" };
export type Mutation = (workspace: Workspace) => { workspace: Workspace; entityType: string; entityId: string; action: string; before: Record<string, unknown> | null; after: Record<string, unknown> | null; sourceIds?: string[] };

export async function executeCommand(repository: WorkspaceRepository, expectedRevision: number, actor: CommandActor, mutate: Mutation, now = () => new Date()): Promise<CommitResult> {
  const loaded = await repository.load();
  if (loaded.state !== "READY") return loaded.state === "EMPTY" ? { state: "CONFLICT", actualRevision: null } : loaded;
  if (loaded.workspace.revision !== expectedRevision) return { state: "CONFLICT", actualRevision: loaded.workspace.revision };
  const mutation = mutate(structuredClone(loaded.workspace));
  const sequence = loaded.workspace.audit.length + 1;
  const event = await appendAuditEvent(loaded.workspace.audit, {
    id: `evt_${sequence}`, sequence, timestamp: now().toISOString(), actorType: actor.type, actorId: actor.id,
    action: mutation.action, entityType: mutation.entityType, entityId: mutation.entityId,
    before: mutation.before, after: mutation.after, sourceIds: mutation.sourceIds ?? [],
  });
  return repository.commit(expectedRevision, { ...mutation.workspace, revision: expectedRevision + 1, audit: [...loaded.workspace.audit, event] });
}

export class DomainRuleError extends Error {}
export type ProposalAction = "APPROVE" | "EDIT" | "REJECT" | "OVERRIDE_COMPLETE" | "CONFIRM_COMPLETE" | "KEEP_OPEN";
export type EvidenceCorrection = { relevance?: "RELEVANT" | "UNRELATED"; locator?: z.input<typeof locatorSchema>; period?: string | null; unit?: string | null; supportsRequestItemId?: string };

const requiredReason = (reason: string | undefined, label: string) => {
  const value = reason?.trim();
  if (!value) throw new DomainRuleError(`${label} requires a reason`);
  return value;
};
const findProposal = (workspace: Workspace, proposalId: string) => {
  const proposal = workspace.proposals.find(({ id }) => id === proposalId);
  if (!proposal) throw new DomainRuleError(`Unknown proposal ${proposalId}`);
  if (proposal.proposalState !== "READY") throw new DomainRuleError(`Proposal ${proposalId} is ${proposal.proposalState.toLowerCase()}`);
  return proposal;
};

/** Returns the existing saved result for a replayed UI command without another write or audit event. */
export async function executeIdempotentCommand(repository: WorkspaceRepository, expectedRevision: number, actor: CommandActor, commandId: string, mutate: Mutation, now = () => new Date()): Promise<CommitResult> {
  const loaded = await repository.load();
  if (loaded.state === "READY" && loaded.workspace.decisions.some((decision) => decision.commandId === commandId)) return { state: "SAVED", workspace: loaded.workspace };
  return executeCommand(repository, expectedRevision, actor, mutate, now);
}

export function decideProposal(input: { proposalId: string; commandId: string; actorId: string; action: ProposalAction; reason?: string; decidedAt: string; editedSupportedItems?: string[] }): Mutation {
  return (workspace) => {
    const proposal = findProposal(workspace, input.proposalId);
    const requestIndex = workspace.requests.findIndex(({ id }) => id === proposal.requestId);
    if (requestIndex < 0) throw new DomainRuleError(`Unknown request ${proposal.requestId}`);
    const request = workspace.requests[requestIndex]!;
    const before = { requestStatus: request.approvedStatus, proposalState: proposal.proposalState };
    let reason = input.reason?.trim() || null;
    let approvedStatus = request.approvedStatus;
    let proposalState: typeof proposal.proposalState = "RECORDED";
    if (input.action === "REJECT") proposalState = "REJECTED";
    else if (input.action === "KEEP_OPEN") approvedStatus = request.approvedStatus;
    else if (input.action === "OVERRIDE_COMPLETE") { reason = requiredReason(input.reason, "Completeness override"); approvedStatus = "COMPLETE"; }
    else if (input.action === "CONFIRM_COMPLETE") {
      if (proposal.proposedStatus !== "READY_TO_COMPLETE" || proposal.missingItems.length) throw new DomainRuleError("Only a fully supported ready-to-complete proposal can be completed");
      const unusable = workspace.attachments.some(({ evidenceIds, processingState }) => evidenceIds.some((evidenceId) => workspace.evidence.some(({ id, supportsRequestItemId }) => id === evidenceId && proposal.supportedItems.includes(supportsRequestItemId))) && processingState !== "PARSED");
      if (unusable) throw new DomainRuleError("Unreadable or unprocessed replacement evidence prevents completion");
      approvedStatus = "COMPLETE";
    } else if (input.action === "APPROVE" || input.action === "EDIT") {
      if (proposal.proposedStatus === "READY_TO_COMPLETE") throw new DomainRuleError("Ready-to-complete proposals require explicit confirmation");
      approvedStatus = "PARTIAL_EVIDENCE_MISSING";
    }
    const edited = input.action === "EDIT" && input.editedSupportedItems ? input.editedSupportedItems : proposal.supportedItems;
    const missing = request.items.filter(({ id, required }) => required && !edited.includes(id)).map(({ id }) => id);
    const after = { requestStatus: approvedStatus, proposalState, supportedItems: edited, missingItems: missing };
    const decision = { id: `decision_${input.commandId}`, commandId: input.commandId, proposalId: proposal.id, actorId: input.actorId, action: input.action, reason, decidedAt: input.decidedAt, before, after, sourceIds: [...new Set(proposal.findingIds.flatMap((id) => workspace.findings.find((finding) => finding.id === id)?.sourceIds ?? []))] };
    const appliesCoverage = input.action === "APPROVE" || input.action === "EDIT" || input.action === "CONFIRM_COMPLETE";
    const requests = workspace.requests.map((value, index) => index === requestIndex ? { ...value, approvedStatus, items: appliesCoverage ? value.items.map((item) => ({ ...item, coverageState: edited.includes(item.id) ? "SUPPORTED" as const : "MISSING" as const })) : value.items } : value);
    const proposals = workspace.proposals.map((value) => value.id === proposal.id ? { ...value, proposalState } : value);
    return { workspace: { ...workspace, requests, proposals, decisions: [...workspace.decisions, decision] }, entityType: "proposal", entityId: proposal.id, action: `PROPOSAL_${input.action}`, before, after, sourceIds: decision.sourceIds };
  };
}

export function decideConflict(input: { findingId: string; commandId: string; actorId: string; decision: "DISMISS_CONFLICT" | "CONFIRM_CONFLICT" | "ACCEPT_EXPLANATION"; reason?: string; decidedAt: string }): Mutation {
  return (workspace) => {
    const finding = workspace.findings.find(({ id }) => id === input.findingId);
    if (!finding || finding.type !== "POTENTIAL_CONFLICT") throw new DomainRuleError(`Unknown conflict ${input.findingId}`);
    const reason = requiredReason(input.reason, input.decision === "ACCEPT_EXPLANATION" ? "Explanation acceptance" : "Conflict decision");
    const state = input.decision === "DISMISS_CONFLICT" || input.decision === "ACCEPT_EXPLANATION" ? "DISMISSED" as const : "RESOLVED" as const;
    const before = { state: finding.state }; const after = { state, reason };
    const decision = { id: `decision_${input.commandId}`, commandId: input.commandId, proposalId: `finding:${finding.id}`, actorId: input.actorId, action: input.decision, reason, decidedAt: input.decidedAt, before, after, sourceIds: finding.sourceIds };
    return { workspace: { ...workspace, findings: workspace.findings.map((value) => value.id === finding.id ? { ...value, state } : value), decisions: [...workspace.decisions, decision] }, entityType: "finding", entityId: finding.id, action: input.decision, before, after, sourceIds: finding.sourceIds };
  };
}

export function correctEvidence(input: { evidenceId: string; correctionId: string; actorId: string; correctedAt: string; patch: EvidenceCorrection }): Mutation {
  return (workspace) => {
    const index = workspace.evidence.findIndex(({ id }) => id === input.evidenceId);
    if (index < 0) throw new DomainRuleError(`Unknown evidence ${input.evidenceId}`);
    const current = workspace.evidence[index]!;
    const request = workspace.requests.find(({ items }) => items.some(({ id }) => id === (input.patch.supportsRequestItemId ?? current.supportsRequestItemId)));
    if (!request) throw new DomainRuleError("Correction must map to an existing request item");
    const corrected = { ...current, ...input.patch, locator: input.patch.locator ? locatorSchema.parse(input.patch.locator) : current.locator };
    const invalidated = workspace.proposals.filter(({ requestId, proposalState }) => requestId === request.id && proposalState === "READY").map(({ id }) => id);
    const relevant = workspace.evidence.map((value, position) => position === index ? corrected : value).filter(({ relevance }) => relevance === "RELEVANT");
    const supportedItems = request.items.filter((item) => relevant.some(({ supportsRequestItemId }) => supportsRequestItemId === item.id)).map(({ id }) => id);
    const missingItems = request.items.filter(({ id, required }) => required && !supportedItems.includes(id)).map(({ id }) => id);
    const revised = { id: `proposal_${request.id.replace(/[^a-z0-9]+/gi, "_").toLowerCase()}_r${workspace.revision + 1}`, requestId: request.id, previousStatus: request.approvedStatus, proposedStatus: missingItems.length ? "PARTIAL_EVIDENCE_MISSING" as const : "READY_TO_COMPLETE" as const, proposalState: "READY" as const, supportedItems, missingItems, findingIds: workspace.findings.filter(({ dealId, state }) => dealId === request.dealId && state === "OPEN").map(({ id }) => id), requiresHumanApproval: true as const };
    const correction = { id: input.correctionId, evidenceId: current.id, actorId: input.actorId, correctedAt: input.correctedAt, before: current, after: corrected, invalidatedProposalIds: invalidated };
    return { workspace: { ...workspace, evidence: workspace.evidence.map((value, position) => position === index ? corrected : value), proposals: [...workspace.proposals.map((value) => invalidated.includes(value.id) ? { ...value, proposalState: "STALE" as const } : value), revised], corrections: [...workspace.corrections, correction] }, entityType: "evidence", entityId: current.id, action: "EVIDENCE_CORRECTED", before: current, after: corrected, sourceIds: [current.sourceId] };
  };
}

export function escalateFinding(input: { findingId: string; escalationId: string; actorId: string; assignedToUserId: string; reason: string; createdAt: string }): Mutation {
  return (workspace) => {
    const finding = workspace.findings.find(({ id }) => id === input.findingId);
    const access = workspace.dealAccess.find(({ dealId, userId, role, state }) => dealId === finding?.dealId && userId === input.assignedToUserId && role === "DEAL_LEAD" && state === "ACTIVE");
    if (!finding || !access) throw new DomainRuleError("Escalation requires an active deal lead");
    const reason = requiredReason(input.reason, "Escalation");
    const escalation = { id: input.escalationId, findingId: finding.id, assignedToUserId: input.assignedToUserId, actorId: input.actorId, reason, createdAt: input.createdAt, internalHref: `/deals/${finding.dealId}/findings/${finding.id}` };
    return { workspace: { ...workspace, escalations: [...workspace.escalations, escalation] }, entityType: "finding", entityId: finding.id, action: "FINDING_ESCALATED_LOCALLY", before: null, after: escalation, sourceIds: finding.sourceIds };
  };
}
