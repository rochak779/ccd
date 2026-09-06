"use client";

import { AlertTriangle, Check, ChevronRight, FileSpreadsheet, Mail, Minus, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ReviewLifecycle } from "./review-lifecycle";

export type TrackerRequest = {
  id: string; title: string; owner: string | null; requestedFrom: string | null;
  coverage: string; approvedStatus: "Awaiting response" | "Partial — evidence missing" | "Complete";
  proposal: string | null; due: string | null; requestedAt: string; components: string[]; source: string;
};

export const NORTHSTAR_REQUESTS: TrackerRequest[] = [
  { id: "C-14", title: "Customer concentration information", owner: "Priya Shah", requestedFrom: "James Carter", coverage: "1 of 4 supported · 3 missing", approvedStatus: "Awaiting response", proposal: "Partial — evidence missing", due: "2026-09-08", requestedAt: "2026-09-02", components: ["Top ten customer contracts", "Revenue by customer FY25", "Revenue by customer FY26", "Current contract expiry dates"], source: "Northstar_Diligence_Tracker.xlsx · Requests!A15:H15" },
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

export function DealOverview({ limitedBaseline = false, monitoringActive = true, requests = NORTHSTAR_REQUESTS, onReview }: { limitedBaseline?: boolean; monitoringActive?: boolean; requests?: TrackerRequest[]; onReview?: () => void }) {
  const awaiting = requests.filter((request) => request.approvedStatus === "Awaiting response").length;
  const partial = requests.filter((request) => request.approvedStatus === "Partial — evidence missing").length;
  const complete = requests.filter((request) => request.approvedStatus === "Complete").length;
  const proposals = requests.filter((request) => request.proposal).length;
  return <section className="feature-stack"><header><p>Project Northstar</p><h2>Confirmatory diligence</h2></header>
    {limitedBaseline && <aside><strong>Limited baseline coverage</strong><p>Request tracking remains available, but comparisons against earlier documents are limited.</p><a href="#baseline">Add baseline documents</a></aside>}
    {!monitoringActive && <aside><strong>Ongoing monitoring is not active</strong><p>Activate the deal address to track future responses.</p><a href="#deal-setup">Activate deal email</a></aside>}
    <section className="attention-summary"><div><h3>Needs attention</h3>{proposals ? <p>{proposals} exception requires review.</p> : <p>Nothing currently needs review.</p>}</div></section>
    {proposals && onReview ? <section className="review-queue" aria-label="Ranked review queue"><article><div className="queue-rank"><span>High · suggested</span><small>Potential conflict · Commercial</small></div><div><strong>F-009 · Customer response is incomplete</strong><p>1 of 4 components supplied. Management’s “stable concentration” statement may conflict with the increase from 22% to 31%.</p><small>Needs analyst review · C-14 · 1 email, 1 workbook, 1 previous claim</small></div><button className="primary-action-global" type="button" onClick={onReview}>Review 3 sources<ChevronRight size={17} aria-hidden /></button></article></section> : null}
    <section><h3>Current diligence</h3><p>{awaiting} awaiting response · {partial} partial · {complete} complete</p></section>
  </section>;
}

type EvaluationAvailability = "ready" | "evaluating" | "unavailable";
type SourceAvailability = "ready" | "unavailable" | "invalid" | "warning" | "no-access";
type InspectorTab = "email" | "workbook" | "previous" | "audit";

const SOURCE_IDS = {
  email: "source-email-c14-reply-20260905",
  workbook: "source-workbook-customer-revenue-fy26-v1",
  previous: "source-pdf-northstar-ic-memo-v3",
} as const;

const COVERAGE = [
  { id: "C-14.1", label: "Top ten customer contracts", claim: "Promised for later delivery", evaluation: "Missing", reason: "No contracts received", source: null },
  { id: "C-14.2", label: "Revenue by customer FY25", claim: "Not mentioned", evaluation: "Missing", reason: "No FY25 schedule received", source: null },
  { id: "C-14.3", label: "Revenue by customer FY26", claim: "FY26 schedule attached", evaluation: "Supported", reason: "Customer schedule received and parsed", source: "Customer_Revenue_FY26.xlsx · Customer Summary!A2:C12" },
  { id: "C-14.4", label: "Current contract expiry dates", claim: "Still being compiled", evaluation: "Missing", reason: "No expiry schedule received", source: null },
] as const;

type ReviewDecision = "pending" | "partial" | "rejected";

export function FindingReview({ onBack, evaluation = "ready", sourceAvailability = "ready", decision, onDecision }: { onBack: () => void; evaluation?: EvaluationAvailability; sourceAvailability?: SourceAvailability; decision: ReviewDecision; onDecision: (decision: ReviewDecision) => void }) {
  const [selectedId, setSelectedId] = useState("C-14.3");
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("workbook");
  const [surroundingRows, setSurroundingRows] = useState(false);
  const [action, setAction] = useState<"none" | "edit" | "reject" | "override" | "conflict" | "correct" | "escalate">("none");
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const selected = COVERAGE.find(({ id }) => id === selectedId)!;
  const evaluationReady = evaluation === "ready";

  return <article className="review-record" aria-labelledby="finding-title">
    <header className="review-toolbar"><button type="button" onClick={onBack}>← Overview</button><div><span>Finding F-009</span><h2 id="finding-title">Customer evidence incomplete</h2></div><span className="suggested-severity"><ShieldAlert size={16} aria-hidden />High · suggested</span></header>
    <div className="review-columns">
      <section className="review-thread" aria-labelledby="thread-title">
        <div><span>C-14</span><h2 id="thread-title">Customer concentration</h2></div>
        <ol className="thread-events">
          <li><Mail size={17} aria-hidden /><span><strong>2 Sep · Priya requested</strong>4 evidence components</span></li>
          <li><FileSpreadsheet size={17} aria-hidden /><span><strong>5 Sep · James replied</strong>1 workbook attached</span></li>
        </ol>
        <blockquote>“Please see the FY26 schedule. Customer concentration remains stable. Contracts and expiry dates are still being compiled.”</blockquote>
        <div className="confidence-note"><span>Evaluation confidence</span><strong>{evaluationReady ? "97%" : "Unavailable"}</strong><small>Confidence is system-suggested, not a human decision.</small></div>
      </section>

      <section className="review-proposal" aria-labelledby="proposal-title">
        <div className="status-comparison"><div><span>Current approved</span><strong>Awaiting response</strong></div><ChevronRight aria-hidden /><div><span>Proposed</span><strong id="proposal-title">{evaluationReady ? "Partial — evidence missing" : "Evaluation unavailable"}</strong></div></div>
        {evaluation === "evaluating" ? <aside role="status"><strong>Evaluating response</strong><p>The request, last approved status and received sources remain available while coverage is checked.</p></aside> : null}
        {evaluation === "unavailable" ? <aside role="alert"><strong>Evaluation unavailable</strong><p>The proposed update cannot be shown. The approved tracker remains unchanged and the raw reply is still readable.</p></aside> : null}
        {evaluationReady ? <>
          <div className="coverage-heading"><div><h3>Coverage</h3><p>Requested, claimed and supported are kept separate.</p></div><strong>1 of 4 supported · 3 missing</strong></div>
          <div className="coverage-matrix" role="group" aria-label="Request coverage">
            {COVERAGE.map((row) => <button key={row.id} type="button" className={selectedId === row.id ? "selected" : ""} aria-pressed={selectedId === row.id} onClick={() => setSelectedId(row.id)}>
              <span className={row.evaluation === "Supported" ? "coverage-state supported-state" : "coverage-state missing-state"}>{row.evaluation === "Supported" ? <Check size={15} aria-hidden /> : <Minus size={15} aria-hidden />}{row.evaluation}</span>
              <strong>{row.label}</strong><small><b>Email claim</b>{row.claim}</small><small><b>Attachment support</b>{row.reason}</small><ChevronRight size={18} aria-hidden />
            </button>)}
          </div>
          <section className="conflict-summary"><div><AlertTriangle size={20} aria-hidden /><div><strong>Potential narrative-to-data conflict</strong><p>“Stable concentration” does not appear consistent with the supplied increase.</p></div></div><dl><div><dt>Management statement</dt><dd>“Stable” <button type="button" onClick={() => setInspectorTab("email")}>Email · paragraph 2</button></dd></div><div><dt>FY25</dt><dd>22% <button type="button" onClick={() => setInspectorTab("previous")}>IC memo · p.2</button></dd></div><div><dt>FY26</dt><dd>31% <button type="button" onClick={() => setInspectorTab("workbook")}>Workbook · C3</button></dd></div><strong>+9 pp</strong></dl></section>
          <DecisionControls decision={decision} action={action} reason={reason} notice={notice} onAction={(next) => { setAction(next); setReason(""); setNotice(""); }} onReason={setReason} onApprove={() => { onDecision("partial"); setNotice("Decision recorded. C-14 remains open with 3 missing items."); }} onSubmit={() => {
            if ((action === "reject" || action === "override" || action === "conflict" || action === "correct") && !reason.trim()) { setNotice("Enter a reason before recording this decision."); return; }
            if (action === "reject") onDecision("rejected");
            const messages = { edit: "Edited proposal recorded separately; the original proposal is retained.", reject: "Proposal rejected. The approved tracker remains unchanged.", override: "Completeness override recorded with 3 missing-evidence labels retained.", conflict: "Conflict decision recorded independently with its rationale.", correct: "Evidence correction recorded. The earlier approval remains historical and a revised proposal is ready.", escalate: "Finding assigned to deal lead Sam Lee. No email was sent.", none: "" };
            setNotice(messages[action]); setAction("none"); setReason("");
          }} />
        </> : null}
      </section>

      <section className="source-context" aria-labelledby="source-title">
        <div><span>Selected component</span><h2 id="source-title">{selected.label}</h2></div>
        {selected.source ? <EvidenceInspector activeTab={inspectorTab} onTab={setInspectorTab} availability={sourceAvailability} surroundingRows={surroundingRows} onSurroundingRows={() => setSurroundingRows((open) => !open)} /> : <div className="gap-explanation"><Minus size={22} aria-hidden /><strong>No supporting source</strong><p>{selected.reason}. The reply’s wording is shown for context, but it is not evidence that this component was supplied.</p></div>}
      </section>
    </div>
  </article>;
}

function DecisionControls({ decision, action, reason, notice, onAction, onReason, onApprove, onSubmit }: { decision: ReviewDecision; action: "none" | "edit" | "reject" | "override" | "conflict" | "correct" | "escalate"; reason: string; notice: string; onAction: (action: "none" | "edit" | "reject" | "override" | "conflict" | "correct" | "escalate") => void; onReason: (value: string) => void; onApprove: () => void; onSubmit: () => void }) {
  return <section className="decision-controls" aria-label="Reviewer decisions">
    <div className="decision-actions"><button className="primary-action-global" type="button" disabled={decision === "partial"} onClick={onApprove}>{decision === "partial" ? "Partial recorded" : "Approve as partial"}</button><button type="button" onClick={() => onAction("edit")}>Edit proposed update</button><button type="button" onClick={() => onAction("reject")}>Reject proposal</button></div>
    <details><summary>Corrections and escalation</summary><div className="secondary-decisions"><button type="button" onClick={() => onAction("correct")}>Correct period or relevance</button><button type="button" onClick={() => onAction("override")}>Override completeness</button><button type="button" onClick={() => onAction("conflict")}>Decide potential conflict</button><button type="button" onClick={() => onAction("escalate")}>Escalate to deal lead</button></div></details>
    {action !== "none" ? <div className="decision-form"><label>{action === "override" ? "Reason for override" : "Decision rationale"}<textarea value={reason} onChange={(event) => onReason(event.target.value)} placeholder={action === "escalate" ? "Optional internal note" : "Required for material corrections and overrides"} /></label><div><button type="button" onClick={onSubmit}>Record {action}</button><button type="button" onClick={() => onAction("none")}>Cancel</button></div></div> : null}
    {notice ? <p className={notice.startsWith("Enter") ? "decision-error" : "decision-notice"} role={notice.startsWith("Enter") ? "alert" : "status"}>{notice}</p> : null}
  </section>;
}

function EvidenceInspector({ activeTab, onTab, availability, surroundingRows, onSurroundingRows }: { activeTab: InspectorTab; onTab: (tab: InspectorTab) => void; availability: SourceAvailability; surroundingRows: boolean; onSurroundingRows: () => void }) {
  const tabs: { id: InspectorTab; label: string }[] = [{ id: "email", label: "Email" }, { id: "workbook", label: "Workbook" }, { id: "previous", label: "Previous evidence" }, { id: "audit", label: "Audit" }];
  return <div className="evidence-inspector">
    <div className="inspector-tabs" role="tablist" aria-label="Evidence sources">{tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} aria-controls={`source-panel-${tab.id}`} onClick={() => onTab(tab.id)}>{tab.label}</button>)}</div>
    <div id={`source-panel-${activeTab}`} role="tabpanel" className="source-preview">
      {activeTab === "email" ? <><SourceMeta kind="Original email" name="James Carter reply · 5 September 2026" sourceId={SOURCE_IDS.email} locator="Body · paragraph 2" period="FY26" unit="Narrative statement" /><blockquote>“Please see the FY26 schedule. Customer concentration remains stable. Contracts and expiry dates are still being compiled.”</blockquote><p>Surrounding context: James confirms one attachment and describes the contracts and expiry dates as outstanding.</p></> : null}
      {activeTab === "workbook" ? <WorkbookSource availability={availability} surroundingRows={surroundingRows} onSurroundingRows={onSurroundingRows} /> : null}
      {activeTab === "previous" ? <><SourceMeta kind="Previous evidence" name="Northstar_IC_Memo.pdf · version 3" sourceId={SOURCE_IDS.previous} locator="Page 2 · paragraph 4" period="FY25" unit="% of revenue" /><blockquote>“Largest Customer Ltd represented 22% of FY25 revenue.”</blockquote><p>Page context: customer concentration is discussed alongside the top-five customer share. This is prior evidence, not support for the requested FY26 schedule.</p></> : null}
      {activeTab === "audit" ? <><SourceMeta kind="Provenance audit" name="C-14 evidence links" sourceId={SOURCE_IDS.workbook} locator="Customer Summary!C3" period="FY26" unit="% of revenue" /><ol className="audit-list"><li><strong>5 Sep 2026 · 10:42</strong>Email and attachment received from James Carter.</li><li><strong>5 Sep 2026 · 10:43</strong>Workbook parsed; C3 retained as raw value 0.31 and displayed value 31%.</li><li><strong>5 Sep 2026 · 10:44</strong>Source linked to C-14.3 by evaluation; not yet analyst-approved.</li></ol></> : null}
    </div>
  </div>;
}

function SourceMeta({ kind, name, sourceId, locator, period, unit }: { kind: string; name: string; sourceId: string; locator: string; period: string; unit: string }) {
  return <><span>{kind}</span><strong>{name}</strong><code>{locator}</code><dl className="source-metadata"><div><dt>Source ID</dt><dd><code>{sourceId}</code></dd></div><div><dt>Period</dt><dd>{period}</dd></div><div><dt>Unit</dt><dd>{unit}</dd></div></dl></>;
}

function WorkbookSource({ availability, surroundingRows, onSurroundingRows }: { availability: SourceAvailability; surroundingRows: boolean; onSurroundingRows: () => void }) {
  if (availability !== "ready" && availability !== "warning") {
    const state = availability === "invalid" ? ["Invalid locator", "Customer Summary!C99 does not resolve to the cited observation. No whole-document citation has been substituted."] : availability === "no-access" ? ["No local file access", "This browser cannot access the local workbook. The recorded filename, source ID and locator remain available."] : ["Source unavailable", "The workbook preview cannot be loaded. Its recorded filename, source ID and locator are retained."];
    return <aside role="alert"><strong>{state[0]}</strong><p>{state[1]}</p><code>Customer_Revenue_FY26.xlsx · {SOURCE_IDS.workbook} · Customer Summary!C3</code></aside>;
  }
  return <><SourceMeta kind="Workbook evidence" name="Customer_Revenue_FY26.xlsx · version 1" sourceId={SOURCE_IDS.workbook} locator="Customer Summary!C3" period="FY26" unit="% of revenue" /><span>Surrounding range <code>Customer Summary!A2:C12</code></span>{availability === "warning" ? <aside role="status"><strong>Parse warning</strong><p>Workbook formatting was partially recovered. The cited raw value, displayed value and formula context remain readable.</p></aside> : null}<table aria-label="Workbook surrounding rows"><thead><tr><th>Row</th><th>Customer</th><th>Revenue</th><th>Share</th></tr></thead><tbody>{surroundingRows ? <tr><th scope="row">2</th><td>Customer</td><td>Revenue</td><td>Share</td></tr> : null}<tr className="source-highlight"><th scope="row">3</th><td>Largest Customer Ltd</td><td>£9.3m</td><td>31%</td></tr>{surroundingRows ? <><tr><th scope="row">4</th><td>Customer B</td><td>£4.8m</td><td>16%</td></tr><tr><th scope="row">5</th><td>Customer C</td><td>£3.6m</td><td>12%</td></tr></> : null}</tbody></table><p><strong>Cell C3</strong> · raw value <code>0.31</code> · displayed value <code>31%</code> · formula <code>=B3/$B$13</code></p><button className="context-toggle" type="button" aria-expanded={surroundingRows} onClick={onSurroundingRows}>{surroundingRows ? "Close surrounding rows" : "Open surrounding rows"}</button></>;
}

export function SampleReviewWorkspace({ evaluation = "ready", sourceAvailability = "ready" }: { evaluation?: EvaluationAvailability; sourceAvailability?: SourceAvailability }) {
  const [reviewing, setReviewing] = useState(false);
  const [decision, setDecision] = useState<ReviewDecision>("pending");
  useEffect(() => { const saved = localStorage.getItem("ccd:c14:first-decision") as ReviewDecision | null; if (saved) queueMicrotask(() => setDecision(saved)); }, []);
  function recordDecision(next: ReviewDecision) { setDecision(next); localStorage.setItem("ccd:c14:first-decision", next); }
  return reviewing ? <><FindingReview onBack={() => setReviewing(false)} evaluation={evaluation} sourceAvailability={sourceAvailability} decision={decision} onDecision={recordDecision} /><section className="lifecycle-mount"><ReviewLifecycle unreadableReplacement={sourceAvailability === "warning"} /></section></> : <DealOverview onReview={() => setReviewing(true)} requests={decision === "partial" ? NORTHSTAR_REQUESTS.map((request) => request.id === "C-14" ? { ...request, approvedStatus: "Partial — evidence missing" as const } : request) : NORTHSTAR_REQUESTS} />;
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
