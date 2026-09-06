import type { DemoFixture } from "../domain/contracts.ts";
import { CURRENT_SCHEMA_VERSION, emptyWorkspace, workspaceSchema, type Workspace } from "./repository.ts";

export const cleanOnboardingScenario = (): Workspace => emptyWorkspace();

/** Product-level visibility for local personas. This demonstrates routing only;
 * IndexedDB is not a production authorisation boundary. */
export function visibleDealIds(workspace: Workspace, userId: string): string[] {
  return workspace.dealAccess
    .filter((access) => access.userId === userId && access.state === "ACTIVE")
    .map((access) => access.dealId);
}

export function populatedSampleScenario(fixture: DemoFixture): Workspace {
  return workspaceSchema.parse({
    schemaVersion: CURRENT_SCHEMA_VERSION, revision: 0,
    organisations: [fixture.organisation], users: fixture.users, memberships: fixture.memberships,
    deals: [fixture.deal], dealAccess: fixture.dealAccess, senderPolicies: [fixture.senderPolicy],
    sources: fixture.sources, baselineClaims: fixture.baselineClaims, messages: fixture.messages,
    attachments: fixture.attachments, requests: fixture.requests, evidence: fixture.evidence,
    findings: fixture.findings, proposals: fixture.proposals, decisions: fixture.decisions, corrections: fixture.corrections, escalations: fixture.escalations, audit: fixture.audit,
  });
}

export type SecondResponseData = Pick<Workspace, "sources" | "messages" | "attachments" | "evidence"> & { requestId: string; proposalId: string };

/** Adds a prepared second response without replacing any first-response source or decision history. */
export function secondResponseScenario(workspace: Workspace, data: SecondResponseData): Workspace {
  const request = workspace.requests.find(({ id }) => id === data.requestId);
  if (!request) throw new Error(`Unknown request ${data.requestId}`);
  const evidence = [...workspace.evidence, ...data.evidence];
  const supportedItems = request.items.filter((item) => evidence.some(({ supportsRequestItemId, relevance }) => supportsRequestItemId === item.id && relevance === "RELEVANT")).map(({ id }) => id);
  const missingItems = request.items.filter(({ id, required }) => required && !supportedItems.includes(id)).map(({ id }) => id);
  return workspaceSchema.parse({ ...workspace, sources: [...workspace.sources, ...data.sources], messages: [...workspace.messages, ...data.messages], attachments: [...workspace.attachments, ...data.attachments], evidence, proposals: [...workspace.proposals, { id: data.proposalId, requestId: request.id, previousStatus: request.approvedStatus, proposedStatus: missingItems.length ? "PARTIAL_EVIDENCE_MISSING" : "READY_TO_COMPLETE", proposalState: "READY", supportedItems, missingItems, findingIds: workspace.findings.filter(({ dealId, state }) => dealId === request.dealId && state === "OPEN").map(({ id }) => id), requiresHumanApproval: true }] });
}
