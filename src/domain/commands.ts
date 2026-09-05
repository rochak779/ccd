import { appendAuditEvent } from "../audit/index.ts";
import type { CommitResult, Workspace, WorkspaceRepository } from "../data/repository.ts";

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
