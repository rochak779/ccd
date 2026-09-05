"use client";

import { useEffect, useMemo, useState } from "react";

export type DealSetupState = {
  projectName: string;
  targetCompany: string;
  stage: string;
  owner: string;
  alias: string;
  aliasCopied: boolean;
  baselineReady: boolean;
  baselineReviewed: boolean;
  monitoring: "inactive" | "testing" | "active" | "failed";
};

const KEY = "ccd:s07:deal";
const initial: DealSetupState = { projectName: "", targetCompany: "", stage: "Confirmatory diligence", owner: "Priya Shah", alias: "", aliasCopied: false, baselineReady: false, baselineReviewed: false, monitoring: "inactive" };

function codeFor(name: string) {
  return name.replace(/^project\s+/i, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "deal";
}

export function deterministicDealAlias(name: string, occupied: readonly string[] = []) {
  const base = `${codeFor(name)}@inbound.ccd.test`;
  if (!occupied.includes(base)) return base;
  let suffix = 2;
  while (occupied.includes(`${codeFor(name)}-${suffix}@inbound.ccd.test`)) suffix += 1;
  return `${codeFor(name)}-${suffix}@inbound.ccd.test`;
}

export function useDealSetup() {
  const [deal, setDeal] = useState(initial);
  useEffect(() => { const saved = localStorage.getItem(KEY); if (saved) queueMicrotask(() => setDeal(JSON.parse(saved) as DealSetupState)); }, []);
  useEffect(() => { if (deal.projectName) localStorage.setItem(KEY, JSON.stringify(deal)); }, [deal]);
  return { deal, update: (patch: Partial<DealSetupState>) => setDeal((value) => ({ ...value, ...patch })), reset: () => { localStorage.removeItem(KEY); setDeal(initial); } };
}

export function DealSetup({ occupiedAliases = [] }: { occupiedAliases?: string[] }) {
  const { deal, update } = useDealSetup();
  const [message, setMessage] = useState("");
  const tasks = useMemo(() => [
    ["Deal created", Boolean(deal.alias), "required"],
    ["Add baseline documents", deal.baselineReady, "recommended"],
    ["Review extracted baseline", deal.baselineReviewed, "required after upload"],
    ["Activate the deal email", deal.monitoring === "active", "required for monitoring"],
    ["Add deal members", false, "optional"],
  ] as const, [deal]);
  const completed = tasks.filter((task) => task[1]).length;

  if (!deal.alias) return <form className="feature-stack" onSubmit={(event) => { event.preventDefault(); if (!deal.projectName.trim() || !deal.targetCompany.trim()) return; update({ alias: deterministicDealAlias(deal.projectName, occupiedAliases) }); }}>
    <h2>Create a deal</h2>
    <label>Project name<input required value={deal.projectName} onChange={(e) => update({ projectName: e.target.value })} /></label>
    <label>Target company<input required value={deal.targetCompany} onChange={(e) => update({ targetCompany: e.target.value })} /></label>
    <label>Stage<input value={deal.stage} onChange={(e) => update({ stage: e.target.value })} /></label>
    <label>Deal owner<input value={deal.owner} onChange={(e) => update({ owner: e.target.value })} /></label>
    <button type="submit">Create deal</button>
  </form>;

  async function copyAlias() {
    await navigator.clipboard?.writeText(deal.alias);
    update({ aliasCopied: true }); setMessage("Copied"); window.setTimeout(() => setMessage(""), 2000);
  }

  function activate() {
    update({ monitoring: "active" });
    setMessage("Test message received and routed. No diligence finding was created.");
  }

  return <section className="feature-stack" aria-labelledby="deal-setup-title">
    <header><p>Setup</p><h2 id="deal-setup-title">Set up {deal.projectName}</h2><p>{completed} of {tasks.length} complete</p></header>
    <label>Secure deal address<input className="mono" readOnly value={deal.alias} onFocus={(e) => e.currentTarget.select()} /></label>
    <p>Add this address in CC on deal conversations.</p>
    <button type="button" onClick={copyAlias}>{deal.aliasCopied ? "Copy again" : "Copy address"}</button>
    {message && <p role="status" aria-live="polite">{message}</p>}
    <ul className="checklist">{tasks.map(([label, done, note]) => <li key={label}><span aria-hidden>{done ? "✓" : "○"}</span> <strong>{label}</strong> <small>{note}</small></li>)}</ul>
    {deal.monitoring !== "active" && <aside role="status"><strong>Ongoing monitoring is not active</strong><p>Run the prepared routing test to activate this demo deal.</p><button className="primary-action-global" type="button" disabled={deal.monitoring === "testing"} onClick={activate}>{deal.monitoring === "testing" ? "Testing route…" : deal.monitoring === "failed" ? "Retry activation" : "Send test message"}</button></aside>}
    {deal.monitoring === "failed" && <button type="button" onClick={() => update({ monitoring: "active" })}>Activate seeded demo mode</button>}
  </section>;
}
