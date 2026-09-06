import { z } from "zod";
import {
  attachmentSchema, auditEnvelopeSchema, baselineClaimSchema, baselineSourceSchema,
  dealAccessSchema, dealSchema, decisionSchema, evidenceSchema, findingSchema,
  membershipSchema, messageSchema, organisationSchema, proposalSchema, requestSchema, correctionSchema, escalationSchema,
  senderPolicySchema, userSchema,
} from "../domain/contracts.ts";

export const CURRENT_SCHEMA_VERSION = 1;

export const workspaceSchema = z.object({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION), revision: z.number().int().nonnegative(),
  organisations: z.array(organisationSchema), users: z.array(userSchema), memberships: z.array(membershipSchema),
  deals: z.array(dealSchema), dealAccess: z.array(dealAccessSchema), senderPolicies: z.array(senderPolicySchema),
  sources: z.array(baselineSourceSchema), baselineClaims: z.array(baselineClaimSchema), messages: z.array(messageSchema),
  attachments: z.array(attachmentSchema), requests: z.array(requestSchema), evidence: z.array(evidenceSchema),
  findings: z.array(findingSchema), proposals: z.array(proposalSchema), decisions: z.array(decisionSchema),
  corrections: z.array(correctionSchema).default([]), escalations: z.array(escalationSchema).default([]),
  audit: z.array(auditEnvelopeSchema),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export type LoadResult = { state: "EMPTY" } | { state: "READY"; workspace: Workspace } |
  { state: "MIGRATION_REQUIRED"; storedVersion: number; targetVersion: number } |
  { state: "INCOMPATIBLE"; storedVersion: number } | { state: "ERROR"; error: unknown };
export type CommitResult = { state: "SAVED"; workspace: Workspace } | { state: "CONFLICT"; actualRevision: number | null } |
  { state: "MIGRATION_REQUIRED"; storedVersion: number; targetVersion: number } |
  { state: "INCOMPATIBLE"; storedVersion: number } | { state: "ERROR"; error: unknown };

export interface WorkspaceRepository {
  load(): Promise<LoadResult>;
  commit(expectedRevision: number, workspace: Workspace): Promise<CommitResult>;
  reset(workspace: Workspace): Promise<CommitResult>;
}

export const emptyWorkspace = (): Workspace => ({
  schemaVersion: CURRENT_SCHEMA_VERSION, revision: 0, organisations: [], users: [], memberships: [], deals: [],
  dealAccess: [], senderPolicies: [], sources: [], baselineClaims: [], messages: [], attachments: [], requests: [],
  evidence: [], findings: [], proposals: [], decisions: [], corrections: [], escalations: [], audit: [],
});
