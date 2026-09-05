import assert from "node:assert/strict";
import test from "node:test";
import { verifyAuditChain } from "../../src/audit/index.ts";
import { executeCommand } from "../../src/domain/commands.ts";
import { cleanOnboardingScenario } from "../../src/data/scenarios.ts";
import type { CommitResult, LoadResult, Workspace, WorkspaceRepository } from "../../src/data/repository.ts";

class MemoryRepository implements WorkspaceRepository {
  public workspace: Workspace;
  private fail: boolean;
  constructor(workspace: Workspace, fail = false) { this.workspace = workspace; this.fail = fail; }
  async load(): Promise<LoadResult> { return { state: "READY", workspace: structuredClone(this.workspace) }; }
  async commit(expectedRevision: number, workspace: Workspace): Promise<CommitResult> {
    if (this.fail) return { state: "ERROR", error: new Error("failed write") };
    if (this.workspace.revision !== expectedRevision) return { state: "CONFLICT", actualRevision: this.workspace.revision };
    this.workspace = structuredClone(workspace); return { state: "SAVED", workspace };
  }
  async reset(workspace: Workspace): Promise<CommitResult> { this.workspace = structuredClone(workspace); return { state: "SAVED", workspace }; }
}

const addDeal = (workspace: Workspace) => {
  const deal = { id: "deal_test", organisationId: "org_test", name: "Test deal", alias: "test@inbound.ccd.test", stage: "Diligence", monitoringState: "INACTIVE" as const };
  return { workspace: { ...workspace, deals: [...workspace.deals, deal] }, entityType: "deal", entityId: deal.id, action: "DEAL_CREATED", before: null, after: deal, sourceIds: [] };
};

test("a command commits its record, revision and verifiable audit event together", async () => {
  const repository = new MemoryRepository(cleanOnboardingScenario());
  const result = await executeCommand(repository, 0, { id: "user_test", type: "USER" }, addDeal, () => new Date("2026-09-05T10:00:00Z"));
  assert.equal(result.state, "SAVED"); assert.equal(repository.workspace.revision, 1);
  assert.equal(repository.workspace.deals[0]?.id, "deal_test"); assert.deepEqual(await verifyAuditChain(repository.workspace.audit), { valid: true });
});

test("a failed write changes neither record nor audit, and stale revisions conflict", async () => {
  const failed = new MemoryRepository(cleanOnboardingScenario(), true);
  assert.equal((await executeCommand(failed, 0, { id: "user_test", type: "USER" }, addDeal)).state, "ERROR");
  assert.equal(failed.workspace.deals.length, 0); assert.equal(failed.workspace.audit.length, 0);
  const repository = new MemoryRepository(cleanOnboardingScenario());
  assert.equal((await executeCommand(repository, 0, { id: "user_test", type: "USER" }, addDeal)).state, "SAVED");
  assert.deepEqual(await executeCommand(repository, 0, { id: "user_test", type: "USER" }, addDeal), { state: "CONFLICT", actualRevision: 1 });
});

test("audit verification identifies the first altered event", async () => {
  const repository = new MemoryRepository(cleanOnboardingScenario());
  await executeCommand(repository, 0, { id: "user_test", type: "USER" }, addDeal);
  repository.workspace.audit[0]!.action = "TAMPERED";
  assert.deepEqual(await verifyAuditChain(repository.workspace.audit), { valid: false, sequence: 1 });
});
