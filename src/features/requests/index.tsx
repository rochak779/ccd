"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type TrackerRequest = {
  id: string; title: string; owner: string | null; requestedFrom: string | null;
  coverage: string; approvedStatus: "Awaiting response" | "Partial — evidence missing" | "Complete";
  proposal: string | null; due: string | null; requestedAt: string; components: string[]; source: string;
};

export const NORTHSTAR_REQUESTS: TrackerRequest[] = [
  { id: "C-14", title: "Customer concentration information", owner: "Priya Shah", requestedFrom: "James Carter", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-08", requestedAt: "2026-09-02", components: ["Top ten customer contracts", "Revenue by customer FY25", "Revenue by customer FY26", "Current contract expiry dates"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A15:H15" },
  { id: "F-02", title: "Monthly management accounts", owner: "Priya Shah", requestedFrom: "Finance team", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-07", requestedAt: "2026-08-28", components: ["Monthly P&L", "Balance sheet", "Cash-flow statement"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A3:H3" },
  { id: "F-05", title: "Quality of earnings bridge", owner: "Sam Lee", requestedFrom: "CFO", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-10", requestedAt: "2026-08-29", components: ["Reported EBITDA", "Adjusting items", "Normalised EBITDA"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A6:H6" },
  { id: "C-03", title: "Customer churn cohorts", owner: "Priya Shah", requestedFrom: "Commercial team", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-09", requestedAt: "2026-08-30", components: ["FY24 cohorts", "FY25 cohorts", "FY26 YTD cohorts"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A9:H9" },
  { id: "C-08", title: "Sales pipeline and conversion", owner: null, requestedFrom: "CRO", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: null, requestedAt: "2026-08-31", components: ["Current pipeline", "Historic conversion", "Pipeline definitions"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A12:H12" },
  { id: "T-04", title: "Platform architecture overview", owner: "Sam Lee", requestedFrom: "CTO", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-12", requestedAt: "2026-09-01", components: ["Architecture diagram", "Hosting inventory", "Key dependencies"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A18:H18" },
  { id: "T-09", title: "Security incident history", owner: "Sam Lee", requestedFrom: "CTO", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: null, requestedAt: "2026-09-13", components: ["Incident register", "Remediation status"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A23:H23" },
  { id: "L-02", title: "Material customer agreements", owner: "Maya Patel", requestedFrom: "General counsel", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-11", requestedAt: "2026-09-01", components: ["Executed agreements", "Side letters"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A26:H26" },
  { id: "L-06", title: "Open litigation and disputes", owner: "Maya Patel", requestedFrom: "General counsel", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-15", requestedAt: "2026-09-02", components: ["Claims schedule", "Counsel assessment"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A30:H30" },
  { id: "P-03", title: "Leadership employment terms", owner: null, requestedFrom: "People lead", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: null, requestedAt: "2026-09-02", components: ["Employment agreements", "Notice terms", "Change-of-control terms"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A32:H32" },
  { id: "P-07", title: "Employee attrition analysis", owner: "Priya Shah", requestedFrom: null, coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-16", requestedAt: "2026-09-03", components: ["Monthly leavers", "Voluntary attrition", "Critical roles"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A34:H34" },
  { id: "I-01", title: "Insurance policies and claims", owner: "Maya Patel", requestedFrom: "CFO", coverage: "No response received", approvedStatus: "Awaiting response", proposal: null, due: "2026-09-05", requestedAt: "2026-08-27", components: ["Current insurer", "Renewal date"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A35:H35" },
];

const FILTER_KEY = "ccd:s10:request-filter";

export function DealOverview({ limitedBaseline = false, monitoringActive = true, requests = NORTHSTAR_REQUESTS }: { limitedBaseline?: boolean; monitoringActive?: boolean; requests?: TrackerRequest[] }) {
  const awaiting = requests.filter((request) => request.approvedStatus === "Awaiting response").length;
  const partial = requests.filter((request) => request.approvedStatus === "Partial — evidence missing").length;
  const complete = requests.filter((request) => request.approvedStatus === "Complete").length;
  const proposals = requests.filter((request) => request.proposal).length;
  return <section className="feature-stack"><header><p>Project Northstar</p><h2>Confirmatory diligence</h2></header>
    {limitedBaseline && <aside><strong>Limited baseline coverage</strong><p>Request tracking remains available, but comparisons against earlier documents are limited.</p><a href="#baseline">Add baseline documents</a></aside>}
    {!monitoringActive && <aside><strong>Ongoing monitoring is not active</strong><p>Activate the deal address to track future responses.</p><a href="#deal-setup">Activate deal email</a></aside>}
    <section><h3>Needs attention</h3>{proposals ? <p>{proposals} decisions require review.</p> : <p>Nothing currently needs review.</p>}</section>
    <section><h3>Current diligence</h3><p>{awaiting} awaiting response · {partial} partial · {complete} complete</p></section>
  </section>;
}

export function RequestTracker({ requests = NORTHSTAR_REQUESTS }: { requests?: TrackerRequest[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState<"id" | "due" | "age">("id");
  const [selected, setSelected] = useState<string | null>(null);
  const region = useRef<HTMLDivElement>(null);
  useEffect(() => { const saved = sessionStorage.getItem(FILTER_KEY); if (saved) { const value = JSON.parse(saved) as { query: string; status: string; sort: "id" | "due" | "age"; scroll: number }; queueMicrotask(() => { setQuery(value.query); setStatus(value.status); setSort(value.sort); requestAnimationFrame(() => region.current?.scrollTo({ top: value.scroll })); }); } }, []);
  useEffect(() => { sessionStorage.setItem(FILTER_KEY, JSON.stringify({ query, status, sort, scroll: region.current?.scrollTop ?? 0 })); }, [query, status, sort, selected]);
  const visible = useMemo(() => requests.filter((request) => (status === "All statuses" || request.approvedStatus === status) && `${request.id} ${request.title} ${request.owner ?? ""} ${request.requestedFrom ?? ""}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "id" ? a.id.localeCompare(b.id) : sort === "due" ? (a.due ?? "9999").localeCompare(b.due ?? "9999") : a.requestedAt.localeCompare(b.requestedAt)), [query, requests, sort, status]);
  const detail = requests.find((request) => request.id === selected);
  if (detail) return <RequestDetail request={detail} onBack={() => setSelected(null)} />;

  return <section className="feature-stack" aria-labelledby="requests-title"><header><p>Requests</p><h2 id="requests-title">Northstar request tracker</h2><p>{requests.length} actual records</p></header>
    <div className="tracker-controls"><label>Search requests<input type="search" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label>Status<select value={status} onChange={(e) => setStatus(e.target.value)}><option>All statuses</option><option>Awaiting response</option><option>Partial — evidence missing</option><option>Complete</option></select></label><label>Sort by<select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="id">Request ID</option><option value="due">Due date</option><option value="age">Oldest request</option></select></label><button type="button" onClick={() => { setQuery(""); setStatus("All statuses"); }}>Clear filters</button></div>
    {!visible.length ? <p>No requests match these filters.</p> : <><p className="tracker-hint">Swipe or scroll the table horizontally to inspect coverage, approved status, proposals and due dates.</p><div ref={region} className="tracker-region" role="region" aria-label="Request tracker" tabIndex={0} onScroll={() => sessionStorage.setItem(FILTER_KEY, JSON.stringify({ query, status, sort, scroll: region.current?.scrollTop ?? 0 }))}><table><thead><tr><th>ID</th><th>Request</th><th>Owner</th><th>Requested from</th><th>Coverage</th><th>Approved status</th><th>Proposal</th><th>Due / age</th></tr></thead><tbody>{visible.map((request) => <tr key={request.id}><td><button type="button" onClick={() => setSelected(request.id)} aria-label={`Open ${request.id}: ${request.title}`}>{request.id}</button></td><td>{request.title}</td><td>{request.owner ?? "Unknown"}</td><td>{request.requestedFrom ?? "Unknown"}</td><td>{request.coverage}</td><td>{request.approvedStatus}</td><td>{request.proposal ?? "—"}</td><td>{request.due ?? "Unknown"}</td></tr>)}</tbody></table></div></>}
  </section>;
}

export function RequestDetail({ request, onBack }: { request: TrackerRequest; onBack: () => void }) {
  return <article className="feature-stack"><button type="button" onClick={onBack}>← Back to requests</button><header><p>{request.id}</p><h2>{request.title}</h2></header><dl><dt>Approved status</dt><dd>{request.approvedStatus}</dd><dt>Proposed update</dt><dd>{request.proposal ?? "No proposal"}</dd><dt>Owner</dt><dd>{request.owner ?? "Unknown"}</dd><dt>Requested from</dt><dd>{request.requestedFrom ?? "Unknown"}</dd><dt>Due date</dt><dd>{request.due ?? "Unknown"}</dd></dl><section><h3>What was requested</h3><ol>{request.components.map((component) => <li key={component}>{component}</li>)}</ol></section><section><h3>Baseline provenance</h3><p>{request.source}</p></section></article>;
}
