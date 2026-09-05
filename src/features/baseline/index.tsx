"use client";

import { useEffect, useState } from "react";

export const BASELINE_LIMITS = { maxFiles: 8, maxBytesPerFile: 10 * 1024 * 1024 } as const;
export type BaselineFileState = "selected" | "validating" | "ready" | "duplicate" | "candidate-version" | "unsupported" | "oversized" | "parse-failed";
export type BaselineFile = { id: string; name: string; category: string; mediaType: string; size: number; hash: string; state: BaselineFileState; warning?: string };
export type ReviewClaim = { id: string; group: "Investment case" | "Key metrics" | "Open requests" | "Warnings"; label: string; value: string; unit: string; period: string; source: string; locator: string; original: { value: string; unit: string; period: string }; state: "candidate" | "confirmed" | "excluded" };
type BaselineState = { files: BaselineFile[]; limitedCoverage: boolean; confirmed: boolean; claims: ReviewClaim[]; corrections: { claimId: string; before: ReviewClaim; after: ReviewClaim }[] };

const KEY = "ccd:s08-09:baseline";
const prepared: BaselineFile[] = [
  { id: "src_ic_memo", name: "Northstar_IC_Memo.pdf", category: "Investment case", mediaType: "application/pdf", size: 1237, hash: "bb88b5e59ba010661798c5958ad0aa6c855a98176313f3ac943f0c7e9e163a32", state: "selected" },
  { id: "src_tracker", name: "Northstar_Diligence_Tracker.xlsx", category: "Open work", mediaType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 7176, hash: "4db0a9fa5419453bc7717febc059fd6afb61f636dba9202041401388ee059dee", state: "selected" },
];
const claims: ReviewClaim[] = [
  { id: "claim-thesis", group: "Investment case", label: "Recurring-revenue growth supports a premium entry multiple", value: "Current thesis", unit: "Text", period: "Current", source: "Northstar_IC_Memo.pdf", locator: "Page 1", original: { value: "Current thesis", unit: "Text", period: "Current" }, state: "candidate" },
  { id: "claim-concentration", group: "Key metrics", label: "Largest customer concentration", value: "22", unit: "%", period: "FY25", source: "Northstar_IC_Memo.pdf", locator: "Page 2", original: { value: "22", unit: "%", period: "FY25" }, state: "candidate" },
  { id: "claim-requests", group: "Open requests", label: "Tracker import", value: "12", unit: "awaiting response", period: "Current", source: "Northstar_Diligence_Tracker.xlsx", locator: "Requests!A2:H35", original: { value: "12", unit: "awaiting response", period: "Current" }, state: "candidate" },
  { id: "warning-owner", group: "Warnings", label: "Tracker rows without an owner", value: "3", unit: "rows", period: "Current", source: "Northstar_Diligence_Tracker.xlsx", locator: "Requests!D2:D35", original: { value: "3", unit: "rows", period: "Current" }, state: "candidate" },
];
const initial: BaselineState = { files: [], limitedCoverage: false, confirmed: false, claims, corrections: [] };

export function useBaseline() {
  const [state, setState] = useState(initial);
  useEffect(() => { const saved = localStorage.getItem(KEY); if (saved) { const parsed = JSON.parse(saved) as BaselineState; queueMicrotask(() => setState({ ...parsed, corrections: parsed.corrections ?? [] })); } }, []);
  useEffect(() => { if (state.files.length || state.limitedCoverage || state.confirmed) localStorage.setItem(KEY, JSON.stringify(state)); }, [state]);
  return { state, setState };
}

export function BaselineWorkspace() {
  const { state, setState } = useBaseline();
  const [skipOpen, setSkipOpen] = useState(false);
  const supported = ["application/pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "text/plain"];
  function addPrepared() { setState((s) => ({ ...s, limitedCoverage: false, files: prepared.map((file) => ({ ...file })) })); }
  function process() { setState((s) => ({ ...s, files: s.files.map((file) => file.state === "selected" || file.state === "candidate-version" || file.state === "parse-failed" ? { ...file, state: "ready" } : file) })); }
  async function addUploads(list: FileList | null) {
    if (!list) return;
    const additions: BaselineFile[] = [];
    for (const file of Array.from(list).slice(0, BASELINE_LIMITS.maxFiles - state.files.length)) {
      const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", await file.arrayBuffer()))).map((v) => v.toString(16).padStart(2, "0")).join("");
      const duplicate = [...state.files, ...additions].find((known) => known.hash === hash);
      const sameName = state.files.find((known) => known.name === file.name && known.hash !== hash);
      additions.push({ id: `upload-${hash.slice(0, 12)}`, name: file.name.replace(/[<>]/g, ""), category: "Needs category", mediaType: file.type, size: file.size, hash, state: file.size > BASELINE_LIMITS.maxBytesPerFile ? "oversized" : !supported.includes(file.type) ? "unsupported" : duplicate ? "duplicate" : sameName ? "candidate-version" : "selected" });
    }
    setState((s) => ({ ...s, files: [...s.files, ...additions] }));
  }
  function updateClaim(id: string, patch: Partial<ReviewClaim>) { setState((s) => { const before = s.claims.find((claim) => claim.id === id); if (!before) return s; const after = { ...before, ...patch }; return { ...s, claims: s.claims.map((claim) => claim.id === id ? after : claim), corrections: [...s.corrections, { claimId: id, before, after }] }; }); }
  const ready = state.files.filter((file) => file.state === "ready").length;

  return <section className="feature-stack" aria-labelledby="baseline-title">
    <header><p>Baseline</p><h2 id="baseline-title">{state.confirmed ? "Northstar baseline confirmed" : "Establish the baseline"}</h2><p>PDF, XLSX, CSV and TXT · up to {BASELINE_LIMITS.maxFiles} files · 10 MB each</p></header>
    {state.limitedCoverage && <aside role="status"><strong>Limited baseline coverage</strong><p>Requests can be tracked, but comparisons against earlier documents are limited.</p><button onClick={() => setState((s) => ({ ...s, limitedCoverage: false }))}>Add baseline documents</button></aside>}
    {!state.confirmed && <><div><button type="button" onClick={addPrepared}>Select prepared memo and tracker</button> <label className="button-label">Choose files<input hidden multiple type="file" accept=".pdf,.xlsx,.csv,.txt" onChange={(e) => void addUploads(e.target.files)} /></label></div>
    {state.files.map((file) => <article key={file.id} className="attachment-card"><strong>{file.name}</strong><label>Category<select value={file.category} onChange={(event) => setState((s) => ({ ...s, files: s.files.map((item) => item.id === file.id ? { ...item, category: event.target.value } : item) }))}><option>Investment case</option><option>Financial model</option><option>Open work</option><option>Needs category</option></select></label><span>{file.state.replaceAll("-", " ")}</span>{file.state === "ready" && <span>Cached extraction · source hash retained</span>}<button type="button" onClick={() => setState((s) => ({ ...s, files: s.files.filter((item) => item.id !== file.id) }))}>Remove</button></article>)}
    {state.files.length > 0 && <p>{ready} of {state.files.length} ready <button type="button" onClick={process}>Process files</button></p>}
    {!state.files.length && <button type="button" onClick={() => setSkipOpen(true)}>Do this later</button>}
    {skipOpen && <div role="dialog" aria-modal="true" aria-labelledby="skip-title"><h3 id="skip-title">Continue without baseline documents?</h3><p>CC’d can still track requests and responses, but has less context for changed or contradictory claims.</p><button onClick={() => { setState((s) => ({ ...s, limitedCoverage: true })); setSkipOpen(false); }}>Continue with limited coverage</button><button onClick={() => setSkipOpen(false)}>Return to upload</button></div>}</>}
    {ready > 0 && <div className="feature-stack"><h3>Review the Northstar baseline</h3>{(["Investment case", "Key metrics", "Open requests", "Warnings"] as const).map((group) => <section key={group}><h4>{group}</h4>{state.claims.filter((claim) => claim.group === group).map((claim) => <fieldset key={claim.id}><legend>{claim.label}</legend><label>Value<input value={claim.value} onChange={(e) => updateClaim(claim.id, { value: e.target.value })} /></label><label>Unit<input value={claim.unit} onChange={(e) => updateClaim(claim.id, { unit: e.target.value })} /></label><label>Period<input value={claim.period} onChange={(e) => updateClaim(claim.id, { period: e.target.value })} /></label><p>Source: {claim.source} · {claim.locator}</p><p>Original extraction: {claim.original.value} {claim.original.unit} · {claim.original.period}</p><button type="button" onClick={() => updateClaim(claim.id, { state: claim.state === "excluded" ? "candidate" : "excluded" })}>{claim.state === "excluded" ? "Include" : "Exclude from comparisons"}</button></fieldset>)}</section>)}<button className="primary-action-global" type="button" onClick={() => setState((s) => ({ ...s, confirmed: true, claims: s.claims.map((claim) => claim.state === "excluded" ? claim : { ...claim, state: "confirmed" }) }))}>Confirm baseline</button></div>}
    {state.confirmed && <p role="status">Confirmed by Priya Shah. {state.corrections.length} correction event{state.corrections.length === 1 ? "" : "s"} retained with the original extraction; only confirmed claims are comparison eligible.</p>}
  </section>;
}
