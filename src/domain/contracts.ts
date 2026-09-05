import { z } from "zod";

const id = z.string().min(1);
const utc = z.string().datetime({ offset: true });
const sha256 = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const email = z.string().email();

export const organisationSchema = z.object({ id, name: z.string().min(1), workDomain: z.string().min(1), type: z.enum(["PRIVATE_EQUITY", "OTHER"]) });
export const userSchema = z.object({ id, name: z.string().min(1), email });
export const membershipSchema = z.object({ id, organisationId: id, userId: id, role: z.enum(["ADMIN", "MEMBER"]), state: z.enum(["ACTIVE", "INVITED", "REVOKED"]) });
export const dealSchema = z.object({ id, organisationId: id, name: z.string().min(1), alias: email, stage: z.string().min(1), monitoringState: z.enum(["INACTIVE", "ACTIVE", "ARCHIVED"]) });
export const dealAccessSchema = z.object({ id, dealId: id, userId: id, role: z.enum(["DEAL_LEAD", "ANALYST", "VIEWER"]), state: z.enum(["ACTIVE", "REMOVED"]) });
export const senderPolicySchema = z.object({ id, organisationId: id, allowedDomains: z.array(z.string()), allowedAddresses: z.array(email) });

export const locatorSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("pdf_page"), page: z.number().int().positive(), excerpt: z.string().min(1) }),
  z.object({ kind: z.literal("spreadsheet_cell"), sheet: z.string().min(1), cell: z.string().regex(/^[A-Z]+[1-9][0-9]*$/) }),
  z.object({ kind: z.literal("spreadsheet_range"), sheet: z.string().min(1), range: z.string().regex(/^[A-Z]+[1-9][0-9]*:[A-Z]+[1-9][0-9]*$/) }),
  z.object({ kind: z.literal("email_excerpt"), messageId: id, excerpt: z.string().min(1) }),
]);

export const baselineSourceSchema = z.object({ id, dealId: id, filename: z.string().min(1), mediaType: z.string().min(1), sha256, versionState: z.enum(["CURRENT", "CANDIDATE", "SUPERSEDED"]) });
export const baselineClaimSchema = z.object({ id, sourceId: id, state: z.enum(["CANDIDATE", "CONFIRMED", "EXCLUDED"]), subject: z.string().min(1), period: z.string().nullable(), rawValue: z.number(), displayValue: z.string().min(1), unit: z.string().min(1), locator: locatorSchema });
export const messageSchema = z.object({ id, dealId: id, source: z.enum(["SEED", "GMAIL"]), providerMessageId: id, internetMessageId: z.string().min(1), threadId: id, inReplyTo: z.string().nullable(), from: email, to: z.array(email), cc: z.array(email), subject: z.string(), sentAt: utc, bodyText: z.string(), bodyHash: sha256, attachmentIds: z.array(id), classification: z.enum(["DILIGENCE_REQUEST", "DILIGENCE_RESPONSE", "SCHEDULING_NOISE"]) });
export const attachmentSchema = z.object({ id, messageId: id, sourceId: id, filename: z.string().min(1), mimeType: z.string().min(1), sizeBytes: z.number().int().positive(), sha256, processingState: z.enum(["RECEIVED", "PARSING", "PARSED", "UNREADABLE", "UNSUPPORTED"]), parseWarnings: z.array(z.string()), evidenceIds: z.array(id) });

export const requestItemSchema = z.object({ id, label: z.string().min(1), evidenceType: z.enum(["CONTRACT", "FINANCIAL_SCHEDULE", "EXPIRY_SCHEDULE", "OTHER"]), period: z.string().nullable(), required: z.boolean(), coverageState: z.enum(["NOT_EVALUATED", "SUPPORTED", "MISSING", "UNREADABLE"]) });
export const requestSchema = z.object({ id, dealId: id, title: z.string().min(1), sourceMessageId: id, requestedFrom: email, requestedAt: utc, approvedStatus: z.enum(["AWAITING_RESPONSE", "PARTIAL_EVIDENCE_MISSING", "COMPLETE", "SUPERSEDED"]), processingState: z.enum(["IDLE", "RESPONSE_PROCESSING", "FAILED"]), items: z.array(requestItemSchema).min(1) });
export const evidenceSchema = z.object({ id, dealId: id, sourceId: id, attachmentId: id.optional(), supportsRequestItemId: id, locator: locatorSchema, displayValue: z.string().min(1), rawValue: z.number(), confidence: z.number().min(0).max(1) });
export const findingSchema = z.object({ id, dealId: id, type: z.enum(["MISSING_EVIDENCE", "UNREADABLE_SOURCE", "POTENTIAL_CONFLICT"]), state: z.enum(["OPEN", "RESOLVED", "DISMISSED"]), suggestedSeverity: z.enum(["HIGH", "MEDIUM", "LOW"]), confirmedSeverity: z.enum(["HIGH", "MEDIUM", "LOW"]).nullable(), sourceIds: z.array(id).min(1), reason: z.string().min(1) });
export const proposalSchema = z.object({ id, requestId: id, previousStatus: z.string(), proposedStatus: z.enum(["PARTIAL_EVIDENCE_MISSING", "READY_TO_COMPLETE"]), proposalState: z.enum(["READY", "STALE", "RECORDED", "REJECTED"]), supportedItems: z.array(id), missingItems: z.array(id), findingIds: z.array(id), requiresHumanApproval: z.literal(true) });
export const decisionSchema = z.object({ id, proposalId: id, actorId: id, action: z.enum(["APPROVE", "EDIT", "REJECT", "ESCALATE", "OVERRIDE_COMPLETE"]), reason: z.string().nullable(), decidedAt: utc, before: z.record(z.string(), z.unknown()), after: z.record(z.string(), z.unknown()), sourceIds: z.array(id) });
export const auditEnvelopeSchema = z.object({ id, sequence: z.number().int().positive(), timestamp: utc, actorType: z.enum(["USER", "SYSTEM"]), actorId: id, action: z.string().min(1), entityType: z.string().min(1), entityId: id, before: z.record(z.string(), z.unknown()).nullable(), after: z.record(z.string(), z.unknown()).nullable(), sourceIds: z.array(id), previousHash: z.string(), hash: sha256 });

export const demoFixtureSchema = z.object({
  organisation: organisationSchema, users: z.array(userSchema), memberships: z.array(membershipSchema),
  deal: dealSchema, dealAccess: z.array(dealAccessSchema), senderPolicy: senderPolicySchema,
  sources: z.array(baselineSourceSchema), baselineClaims: z.array(baselineClaimSchema), messages: z.array(messageSchema),
  attachments: z.array(attachmentSchema), requests: z.array(requestSchema), evidence: z.array(evidenceSchema),
  findings: z.array(findingSchema), proposals: z.array(proposalSchema), decisions: z.array(decisionSchema), audit: z.array(auditEnvelopeSchema),
});

export type DemoFixture = z.infer<typeof demoFixtureSchema>;
