import { CURRENT_SCHEMA_VERSION, type CommitResult, type LoadResult, type Workspace, type WorkspaceRepository, workspaceSchema } from "./repository.ts";

const STORE = "workspace";
const KEY = "current";

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}

export class IndexedDbWorkspaceRepository implements WorkspaceRepository {
  constructor(private readonly name = "ccd", private readonly indexedDb: IDBFactory = indexedDB) {}

  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = this.indexedDb.open(this.name);
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error("IndexedDB upgrade blocked"));
    });
  }

  async load(): Promise<LoadResult> {
    try {
      const db = await this.open();
      const raw = await requestResult(db.transaction(STORE).objectStore(STORE).get(KEY)); db.close();
      if (raw === undefined) return { state: "EMPTY" };
      const version = (raw as { schemaVersion?: unknown }).schemaVersion;
      if (typeof version === "number" && version < CURRENT_SCHEMA_VERSION) return { state: "MIGRATION_REQUIRED", storedVersion: version, targetVersion: CURRENT_SCHEMA_VERSION };
      if (version !== CURRENT_SCHEMA_VERSION) return { state: "INCOMPATIBLE", storedVersion: typeof version === "number" ? version : 0 };
      return { state: "READY", workspace: workspaceSchema.parse(raw) };
    } catch (error) { return { state: "ERROR", error }; }
  }

  async commit(expectedRevision: number, workspace: Workspace): Promise<CommitResult> {
    try {
      workspaceSchema.parse(workspace);
      const db = await this.open();
      const result = await new Promise<CommitResult>((resolve, reject) => {
        const transaction = db.transaction(STORE, "readwrite"); const store = transaction.objectStore(STORE);
        const get = store.get(KEY); let outcome: CommitResult | undefined;
        get.onerror = () => transaction.abort();
        get.onsuccess = () => {
          const current = get.result as { schemaVersion?: number; revision?: number } | undefined;
          if (current?.schemaVersion !== undefined && current.schemaVersion < CURRENT_SCHEMA_VERSION) {
            outcome = { state: "MIGRATION_REQUIRED", storedVersion: current.schemaVersion, targetVersion: CURRENT_SCHEMA_VERSION }; transaction.abort(); return;
          }
          if (current && current.schemaVersion !== CURRENT_SCHEMA_VERSION) {
            outcome = { state: "INCOMPATIBLE", storedVersion: current.schemaVersion ?? 0 }; transaction.abort(); return;
          }
          const actualRevision = current?.revision ?? 0;
          if (actualRevision !== expectedRevision) { outcome = { state: "CONFLICT", actualRevision }; transaction.abort(); return; }
          store.put(workspace, KEY); outcome = { state: "SAVED", workspace };
        };
        transaction.oncomplete = () => outcome ? resolve(outcome) : reject(new Error("IndexedDB transaction completed without a result"));
        transaction.onabort = () => outcome ? resolve(outcome) : reject(transaction.error ?? new Error("IndexedDB transaction aborted"));
        transaction.onerror = () => reject(transaction.error);
      });
      db.close(); return result;
    } catch (error) { return { state: "ERROR", error }; }
  }

  async reset(workspace: Workspace): Promise<CommitResult> {
    const loaded = await this.load();
    if (loaded.state === "MIGRATION_REQUIRED" || loaded.state === "INCOMPATIBLE" || loaded.state === "ERROR") return loaded;
    const revision = loaded.state === "READY" ? loaded.workspace.revision : 0;
    return this.commit(revision, { ...workspace, revision: revision + 1 });
  }
}
