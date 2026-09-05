import type { z } from "zod";
import type { auditEnvelopeSchema } from "../domain/contracts.ts";

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
