import type { z } from "zod";
import type { auditEnvelopeSchema } from "../domain/contracts.ts";
import type { Workspace } from "../data/repository.ts";

export type AuditEvent = z.infer<typeof auditEnvelopeSchema>;
export type AuditEventInput = Omit<AuditEvent, "hash" | "previousHash">;

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`;
}

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return `sha256:${Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export async function appendAuditEvent(events: readonly AuditEvent[], input: AuditEventInput): Promise<AuditEvent> {
  const previousHash = events.at(-1)?.hash ?? "";
  const hash = await sha256(canonical(input) + previousHash);
  return { ...input, previousHash, hash };
}

export async function verifyAuditChain(events: readonly AuditEvent[]): Promise<{ valid: true } | { valid: false; sequence: number }> {
  let previousHash = "";
  for (const event of events) {
    const { hash, previousHash: storedPreviousHash, ...payload } = event;
    if (storedPreviousHash !== previousHash || hash !== await sha256(canonical(payload) + previousHash)) {
      return { valid: false, sequence: event.sequence };
    }
    previousHash = hash;
  }
  return { valid: true };
}

export type EvidenceChainNode = { id: string; kind: "request" | "message" | "source" | "evidence" | "finding" | "proposal" | "decision"; href: string; sourceIds: string[] };

/** A UI-neutral lineage projection; every href points back to the same stored entity used by the inspector. */
export function evidenceChain(workspace: Workspace, findingId: string): EvidenceChainNode[] {
  const finding = workspace.findings.find(({ id }) => id === findingId);
  if (!finding) return [];
  const proposals = workspace.proposals.filter(({ findingIds }) => findingIds.includes(finding.id));
  const requests = workspace.requests.filter(({ id }) => proposals.some(({ requestId }) => requestId === id));
  const evidence = workspace.evidence.filter(({ sourceId }) => finding.sourceIds.includes(sourceId));
  const messages = workspace.messages.filter(({ id }) => finding.sourceIds.includes(id));
  const sources = workspace.sources.filter(({ id }) => finding.sourceIds.includes(id));
  const decisions = workspace.decisions.filter(({ proposalId }) => proposals.some(({ id }) => id === proposalId));
  return [
    ...requests.map(({ id }) => ({ id, kind: "request" as const, href: `/requests/${id}`, sourceIds: [] })),
    ...messages.map(({ id }) => ({ id, kind: "message" as const, href: `/messages/${id}`, sourceIds: [id] })),
    ...sources.map(({ id }) => ({ id, kind: "source" as const, href: `/evidence/sources/${id}`, sourceIds: [id] })),
    ...evidence.map(({ id, sourceId }) => ({ id, kind: "evidence" as const, href: `/evidence/${id}`, sourceIds: [sourceId] })),
    { id: finding.id, kind: "finding", href: `/findings/${finding.id}`, sourceIds: finding.sourceIds },
    ...proposals.map(({ id }) => ({ id, kind: "proposal" as const, href: `/proposals/${id}`, sourceIds: [] })),
    ...decisions.map(({ id, sourceIds }) => ({ id, kind: "decision" as const, href: `/decisions/${id}`, sourceIds })),
  ];
}

export const verifyWorkspaceAudit = async (workspace: Workspace) => ({ eventCount: workspace.audit.length, result: await verifyAuditChain(workspace.audit) });
