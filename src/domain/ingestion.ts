import { z } from "zod";
import type { Workspace } from "../data/repository.ts";

const MAX_BODY_CHARS = 250_000;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "text/plain"]);
const hash = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const extractionSchema = z.object({
  messageType: z.literal("DILIGENCE_REQUEST"), title: z.string().min(1), confidence: z.number().min(0).max(1),
  requestedItems: z.array(z.object({ id: z.string().min(1).optional(), label: z.string().min(1), evidenceType: z.enum(["CONTRACT", "FINANCIAL_SCHEDULE", "EXPIRY_SCHEDULE", "OTHER"]), period: z.string().nullable(), required: z.boolean() })).min(1),
});

export type InboundEnvelope = {
  source: "SEED" | "GMAIL"; providerMessageId: string; internetMessageId: string; threadId: string;
  inReplyTo: string | null; references?: string[]; from: string; to: string[]; cc: string[]; subject: string;
  sentAt: string; receivedAt: string; bodyText: string; bodyHash: string; classification: "DILIGENCE_REQUEST" | "DILIGENCE_RESPONSE" | "SCHEDULING_NOISE";
  attachments?: { id: string; sourceId: string; filename: string; mimeType: string; sizeBytes: number; sha256: string }[];
};
export type RequestExtraction = z.infer<typeof extractionSchema>;
export type Match = { state: "MATCHED"; requestId: string; basis: "IN_REPLY_TO" | "THREAD" | "REFERENCES" } | { state: "SUGGESTED"; requestIds: string[]; reason: "EXPLICIT_ID" | "AMBIGUOUS_CONTENT" } | { state: "NONE" };
export type IngestionResult =
  | { state: "ACCEPTED"; workspace: Workspace; messageId: string; dealId: string; requestId?: string; match: Match; steps: string[] }
  | { state: "DUPLICATE"; workspace: Workspace; existingMessageId: string }
  | { state: "QUARANTINED"; workspace: Workspace; reason: "UNKNOWN_ALIAS" | "UNKNOWN_SENDER" | "DEAL_CONTEXT_MISMATCH" }
  | { state: "REJECTED"; workspace: Workspace; reason: "INVALID_MESSAGE" | "BODY_TOO_LARGE" };

const canonicalEmail = (value: string) => value.trim().toLowerCase();
const safeFilename = (value: string) => value.replace(/[\\/\0-\x1f\x7f]+/g, "_").replace(/^\.+/, "").slice(0, 180) || "attachment";
const senderAllowed = (from: string, policy: Workspace["senderPolicies"][number]) => {
  const address = canonicalEmail(from); const domain = address.split("@")[1] ?? "";
  return policy.allowedAddresses.map(canonicalEmail).includes(address) || policy.allowedDomains.map((v) => v.toLowerCase()).includes(domain);
};

export function matchResponse(workspace: Workspace, message: InboundEnvelope, dealId: string): Match {
  const requests = workspace.requests.filter((r) => r.dealId === dealId && r.approvedStatus !== "SUPERSEDED");
  const source = (requestId: string) => workspace.messages.find((m) => m.id === workspace.requests.find((r) => r.id === requestId)?.sourceMessageId);
  const unique = (ids: string[], basis: "IN_REPLY_TO" | "THREAD" | "REFERENCES"): Match => ids.length === 1 ? { state: "MATCHED", requestId: ids[0], basis } : ids.length > 1 ? { state: "SUGGESTED", requestIds: ids, reason: "AMBIGUOUS_CONTENT" } : { state: "NONE" };
  let result = unique(requests.filter((r) => source(r.id)?.internetMessageId === message.inReplyTo).map((r) => r.id), "IN_REPLY_TO"); if (result.state !== "NONE") return result;
  result = unique(requests.filter((r) => source(r.id)?.threadId === message.threadId).map((r) => r.id), "THREAD"); if (result.state !== "NONE") return result;
  const refs = new Set(message.references ?? []); result = unique(requests.filter((r) => refs.has(source(r.id)?.internetMessageId ?? "")).map((r) => r.id), "REFERENCES"); if (result.state !== "NONE") return result;
  const explicit = requests.filter((r) => new RegExp(`\\b${r.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(`${message.subject}\n${message.bodyText}`)).map((r) => r.id);
  return explicit.length ? { state: "SUGGESTED", requestIds: explicit, reason: "EXPLICIT_ID" } : { state: "NONE" };
}

export function ingestMessage(workspace: Workspace, envelope: InboundEnvelope, extraction?: RequestExtraction): IngestionResult {
  const recipients = [...envelope.to, ...envelope.cc].map(canonicalEmail);
  const deal = workspace.deals.find((candidate) => recipients.includes(canonicalEmail(candidate.alias)));
  if (!deal) return { state: "QUARANTINED", workspace, reason: "UNKNOWN_ALIAS" };
  const referencedMessage = workspace.messages.find((message) => message.internetMessageId === envelope.inReplyTo || (envelope.references ?? []).includes(message.internetMessageId));
  if (referencedMessage && referencedMessage.dealId !== deal.id) return { state: "QUARANTINED", workspace, reason: "DEAL_CONTEXT_MISMATCH" };
  const policy = workspace.senderPolicies.find((candidate) => candidate.organisationId === deal.organisationId);
  if (!policy || !senderAllowed(envelope.from, policy)) return { state: "QUARANTINED", workspace, reason: "UNKNOWN_SENDER" };
  const duplicate = workspace.messages.find((m) => m.providerMessageId === envelope.providerMessageId || (m.internetMessageId === envelope.internetMessageId && m.bodyHash === envelope.bodyHash));
  if (duplicate) return { state: "DUPLICATE", workspace, existingMessageId: duplicate.id };
  if (!z.string().email().safeParse(envelope.from).success || !hash.safeParse(envelope.bodyHash).success) return { state: "REJECTED", workspace, reason: "INVALID_MESSAGE" };
  if (envelope.bodyText.length > MAX_BODY_CHARS) return { state: "REJECTED", workspace, reason: "BODY_TOO_LARGE" };
  const id = `msg_${envelope.providerMessageId.replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  const files = (envelope.attachments ?? []).map((file) => ({ ...file, messageId: id, filename: safeFilename(file.filename), processingState: file.sizeBytes > MAX_FILE_BYTES || !ALLOWED_MIME.has(file.mimeType) ? "UNSUPPORTED" as const : "RECEIVED" as const, parseWarnings: file.sizeBytes > MAX_FILE_BYTES ? ["File exceeds 10 MB limit"] : !ALLOWED_MIME.has(file.mimeType) ? ["Unsupported file type"] : [], evidenceIds: [] }));
  const message = { id, dealId: deal.id, source: envelope.source, providerMessageId: envelope.providerMessageId, internetMessageId: envelope.internetMessageId, threadId: envelope.threadId, inReplyTo: envelope.inReplyTo, references: envelope.references ?? [], from: canonicalEmail(envelope.from), to: envelope.to.map(canonicalEmail), cc: envelope.cc.map(canonicalEmail), subject: envelope.subject, sentAt: envelope.sentAt, receivedAt: envelope.receivedAt, bodyText: envelope.bodyText, bodyHash: envelope.bodyHash, attachmentIds: files.map((f) => f.id), classification: envelope.classification };
  let next: Workspace = { ...workspace, messages: [...workspace.messages, message], attachments: [...workspace.attachments, ...files], sources: [...workspace.sources, { id: `src_${id}_body`, dealId: deal.id, filename: `${id}.txt`, mediaType: "text/plain", sha256: envelope.bodyHash, versionState: "CURRENT" as const }, ...files.map((f) => ({ id: f.sourceId, dealId: deal.id, filename: f.filename, mediaType: f.mimeType, sha256: f.sha256, versionState: "CURRENT" as const }))] };
  let requestId: string | undefined; let match: Match = { state: "NONE" };
  if (envelope.classification === "DILIGENCE_REQUEST") {
    const parsed = extractionSchema.safeParse(extraction); if (!parsed.success) return { state: "REJECTED", workspace, reason: "INVALID_MESSAGE" };
    const existing = next.requests.find((r) => r.dealId === deal.id && (r.id === "C-14" || r.sourceMessageId === id)); requestId = existing?.id ?? "C-14";
    const itemIds = parsed.data.requestedItems.map((item, index) => item.id ?? `${requestId}.${index + 1}`);
    if (itemIds.some((itemId, index) => itemId !== `${requestId}.${index + 1}`)) return { state: "REJECTED", workspace, reason: "INVALID_MESSAGE" };
    if (existing) next = { ...next, requests: next.requests.map((r) => r.id === existing.id ? { ...r, sourceMessageId: id, extraction: { sourceMessageId: id, confidence: parsed.data.confidence } } : r) };
    else next = { ...next, requests: [...next.requests, { id: requestId, dealId: deal.id, title: parsed.data.title, sourceMessageId: id, requestedFrom: canonicalEmail(envelope.to.find((address) => canonicalEmail(address) !== canonicalEmail(deal.alias) && canonicalEmail(address) !== canonicalEmail(envelope.from)) ?? envelope.to[0]), requestedAt: envelope.sentAt, extraction: { sourceMessageId: id, confidence: parsed.data.confidence }, approvedStatus: "AWAITING_RESPONSE", processingState: "IDLE", items: parsed.data.requestedItems.map((item, index) => ({ ...item, id: itemIds[index], coverageState: "NOT_EVALUATED" })) }] };
  } else if (envelope.classification === "DILIGENCE_RESPONSE") { match = matchResponse(next, envelope, deal.id); }
  return { state: "ACCEPTED", workspace: next, messageId: id, dealId: deal.id, requestId, match, steps: ["Email received", "Alias and sender verified", ...(match.state === "MATCHED" ? ["Thread matched"] : []), `${files.length} attachment${files.length === 1 ? "" : "s"} secured`] };
}

export function confirmSuggestedMatch(result: IngestionResult, requestId: string): IngestionResult {
  if (result.state !== "ACCEPTED" || result.match.state !== "SUGGESTED" || !result.match.requestIds.includes(requestId)) throw new Error("Unknown suggested relationship");
  return { ...result, match: { state: "MATCHED", requestId, basis: "THREAD" } };
}
