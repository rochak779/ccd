import type { DemoFixture } from "../domain/contracts.ts";
import { CURRENT_SCHEMA_VERSION, emptyWorkspace, workspaceSchema, type Workspace } from "./repository.ts";

export const cleanOnboardingScenario = (): Workspace => emptyWorkspace();

export function populatedSampleScenario(fixture: DemoFixture): Workspace {
  return workspaceSchema.parse({
    schemaVersion: CURRENT_SCHEMA_VERSION, revision: 0,
    organisations: [fixture.organisation], users: fixture.users, memberships: fixture.memberships,
    deals: [fixture.deal], dealAccess: fixture.dealAccess, senderPolicies: [fixture.senderPolicy],
    sources: fixture.sources, baselineClaims: fixture.baselineClaims, messages: fixture.messages,
    attachments: fixture.attachments, requests: fixture.requests, evidence: fixture.evidence,
    findings: fixture.findings, proposals: fixture.proposals, decisions: fixture.decisions, audit: fixture.audit,
  });
}
