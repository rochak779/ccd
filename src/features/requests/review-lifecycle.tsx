"use client";

import { AlertTriangle, Check, ChevronRight, FileCheck2, Link2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "./review-lifecycle.module.css";

export type LifecycleNodeKind = "request" | "message" | "source" | "locator" | "finding" | "decision";
export type ActivityKind = "Sources" | "AI analysis" | "Human decisions" | "Tracker changes" | "Attachment processing" | "Errors and overrides";
export type LifecycleNode = { id: string; kind: LifecycleNodeKind; title: string; detail: string; locator?: string };
export type LifecycleEvent = { id: string; kind: ActivityKind; title: string; actor: string; timestamp: string; before?: string; after?: string; rationale: string; sourceIds: string[]; hash: string };
export type VerificationResult = { ok: boolean; eventCount: number; failedEventId?: string; expectedHash?: string; actualHash?: string };

export type ReviewLifecycleProps = {
  nodes?: LifecycleNode[];
  events?: LifecycleEvent[];
  verification?: VerificationResult;
  unreadableReplacement?: boolean;
  onOpenNode?: (node: LifecycleNode) => void;
  onVerify?: () => VerificationResult | Promise<VerificationResult>;
  onAcceptExplanation?: (accepted: boolean) => void;
  onComplete?: () => void;
  onKeepOpen?: () => void;
};

export const SAMPLE_LIFECYCLE_NODES: LifecycleNode[] = [
  { id: "req-C-14", kind: "request", title: "C-14 · Customer concentration", detail: "Four requested evidence components" },
  { id: "msg-1", kind: "message", title: "First response", detail: "James Carter · 5 Sep 2026, 09:42" },
  { id: "cell-C3", kind: "locator", title: "FY26 concentration · 31%", detail: "Customer_Revenue_FY26.xlsx", locator: "Customer Summary!C3" },
  { id: "finding-F-009", kind: "finding", title: "F-009 · Concentration change", detail: "Potential narrative-to-data conflict" },
  { id: "decision-partial", kind: "decision", title: "Partial approved", detail: "Priya Shah · 5 Sep 2026, 09:51" },
  { id: "msg-2", kind: "message", title: "Follow-up response", detail: "Three attachments and an explanation · 8 Sep 2026, 14:18" },
  { id: "source-contracts", kind: "source", title: "Top_10_Contracts.pdf", detail: "Top ten customer contracts", locator: "pp. 1–24" },
  { id: "source-fy25", kind: "source", title: "Customer_Revenue_FY25.xlsx", detail: "Revenue by customer FY25", locator: "Customer Summary!A2:C12" },
  { id: "source-expiry", kind: "source", title: "Contract_Expiries.csv", detail: "Current contract expiry dates", locator: "rows 2–11" },
];

export const SAMPLE_LIFECYCLE_EVENTS: LifecycleEvent[] = [
  { id: "evt-001", kind: "Sources", title: "Baseline request imported", actor: "Priya Shah", timestamp: "2 Sep 2026, 10:04", after: "Awaiting response", rationale: "C-14 imported from the approved tracker.", sourceIds: ["req-C-14"], hash: "8d3c7f…91a2" },
  { id: "evt-009", kind: "Attachment processing", title: "FY26 workbook parsed", actor: "CC’d processing", timestamp: "5 Sep 2026, 09:43", after: "Customer Summary!A2:C12", rationale: "Workbook fingerprint matched the received attachment.", sourceIds: ["msg-1", "cell-C3"], hash: "21af06…8be4" },
  { id: "evt-012", kind: "AI analysis", title: "Potential concentration conflict created", actor: "CC’d analysis", timestamp: "5 Sep 2026, 09:43", before: "22%", after: "31%", rationale: "The supplied increase may conflict with ‘remains stable’.", sourceIds: ["cell-C3", "finding-F-009"], hash: "648cdf…3390" },
  { id: "evt-015", kind: "Human decisions", title: "Partial status approved", actor: "Priya Shah", timestamp: "5 Sep 2026, 09:51", before: "Awaiting response", after: "Partial — evidence missing", rationale: "One of four components was supported.", sourceIds: ["decision-partial"], hash: "a904be…6df1" },
  { id: "evt-021", kind: "Tracker changes", title: "Completion proposed", actor: "CC’d analysis", timestamp: "8 Sep 2026, 14:20", before: "Partial — evidence missing", after: "Ready to complete", rationale: "All four requested components now have readable support.", sourceIds: ["msg-2", "source-contracts", "source-fy25", "source-expiry"], hash: "feb10c…771d" },
];

const coverage = [
  ["Top ten customer contracts", "Top_10_Contracts.pdf · pp. 1–24"],
  ["Revenue by customer FY25", "Customer_Revenue_FY25.xlsx · Customer Summary!A2:C12"],
  ["Revenue by customer FY26", "Customer_Revenue_FY26.xlsx · Customer Summary!A2:C12"],
  ["Current contract expiry dates", "Contract_Expiries.csv · rows 2–11"],
] as const;

export function ReviewLifecycle({ nodes = SAMPLE_LIFECYCLE_NODES, events = SAMPLE_LIFECYCLE_EVENTS, verification, unreadableReplacement = false, onOpenNode, onVerify, onAcceptExplanation, onComplete, onKeepOpen }: ReviewLifecycleProps) {
  const [view, setView] = useState<"chain" | "activity" | "complete">("chain");
  const [filter, setFilter] = useState<ActivityKind | "All activity">("All activity");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [localVerification, setLocalVerification] = useState<VerificationResult | undefined>(verification);
  const [verifying, setVerifying] = useState(false);
  const [explanationAccepted, setExplanationAccepted] = useState(false);
  const [status, setStatus] = useState<"partial" | "complete">("partial");
  const filtered = useMemo(() => filter === "All activity" ? events : events.filter((event) => event.kind === filter), [events, filter]);

  async function verify() {
    setVerifying(true);
    const result = onVerify ? await onVerify() : { ok: true, eventCount: events.length };
    setLocalVerification(result);
    setVerifying(false);
  }

  function setExplanation(value: boolean) { setExplanationAccepted(value); onAcceptExplanation?.(value); }
  function complete() { if (unreadableReplacement) return; setStatus("complete"); onComplete?.(); }

  return <article className={styles.record} aria-labelledby="lifecycle-title">
    <header className={styles.header}>
      <div><h2 id="lifecycle-title">C-14 · Customer concentration</h2><p>One inspectable record from request to reviewer decision.</p></div>
      <span className={styles.approved}>Approved status · {status === "complete" ? "Complete" : "Partial — evidence missing"}</span>
    </header>
    <nav className={styles.tabs} aria-label="Request lifecycle views">
      {([['chain', 'Evidence chain'], ['activity', 'Activity'], ['complete', 'Completion review']] as const).map(([id, label]) => <button key={id} type="button" aria-current={view === id ? "page" : undefined} onClick={() => setView(id)}>{label}</button>)}
    </nav>

    {view === "chain" && <section className={styles.section} aria-labelledby="chain-title">
      <div className={styles.sectionHead}><div><h3 id="chain-title">Evidence chain</h3><p>Open any node to inspect the same underlying record used in review.</p></div><button className={styles.verify} type="button" disabled={verifying} onClick={verify}><LockKeyhole size={16} aria-hidden />{verifying ? "Verifying…" : "Verify stored events"}</button></div>
      {localVerification && <div className={localVerification.ok ? styles.verified : styles.failed} role={localVerification.ok ? "status" : "alert"}>
        {localVerification.ok ? <ShieldCheck aria-hidden /> : <AlertTriangle aria-hidden />}<div><strong>{localVerification.ok ? `Event chain verified · ${localVerification.eventCount} events` : `Verification failed at ${localVerification.failedEventId}`}</strong>{!localVerification.ok && <p>Expected <code>{localVerification.expectedHash}</code>; stored event produced <code>{localVerification.actualHash}</code>. History remains readable.</p>}</div>
      </div>}
      <ol className={styles.chain}>{nodes.map((node, index) => <li key={node.id}>
        <button type="button" onClick={() => onOpenNode?.(node)} aria-label={`Open ${node.kind}: ${node.title}`}><span className={styles.kind}>{node.kind}</span><strong>{node.title}</strong><small>{node.detail}</small>{node.locator && <code>{node.locator}</code>}<ChevronRight aria-hidden /></button>{index < nodes.length - 1 && <span className={styles.connector} aria-hidden />}
      </li>)}</ol>
      <p className={styles.truth}>Tamper-evident, not immutable or compliance-certified.</p>
    </section>}

    {view === "activity" && <section className={styles.section} aria-labelledby="activity-title">
      <div className={styles.sectionHead}><div><h3 id="activity-title">Activity</h3><p>Before and after values, actors and source links remain reconstructable.</p></div><label className={styles.filter}>Filter<select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}>{["All activity", "Sources", "AI analysis", "Human decisions", "Tracker changes", "Attachment processing", "Errors and overrides"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <ol className={styles.activity}>{filtered.map((event) => <li key={event.id}><div className={styles.activityTop}><span>{event.kind}</span><time>{event.timestamp}</time></div><h4>{event.title}</h4><p>{event.actor} · {event.rationale}</p>{(event.before || event.after) && <dl><div><dt>Before</dt><dd>{event.before ?? "No recorded value"}</dd></div><ChevronRight aria-hidden /><div><dt>After</dt><dd>{event.after ?? "No recorded value"}</dd></div></dl>}<div className={styles.eventLinks}>{event.sourceIds.map((id) => <button type="button" key={id} onClick={() => { const node = nodes.find((item) => item.id === id); if (node) onOpenNode?.(node); }}><Link2 size={14} aria-hidden />{id}</button>)}<button type="button" aria-expanded={expanded === event.id} onClick={() => setExpanded(expanded === event.id ? null : event.id)}>{expanded === event.id ? "Hide hash" : "Show hash"}</button></div>{expanded === event.id && <code className={styles.hash}>{event.hash}</code>}</li>)}</ol>
    </section>}

    {view === "complete" && <section className={styles.section} aria-labelledby="completion-title">
      <div className={styles.completionHead}><div><h3 id="completion-title">{status === "complete" ? "C-14 is complete" : "C-14 may now be complete"}</h3><p>Proposed · Ready to complete</p></div><span>Current approved · {status === "complete" ? "Complete" : "Partial — evidence missing"}</span></div>
      <p className={styles.coverageSummary}>{unreadableReplacement ? "3 of 4 supported · 1 unreadable" : "4 of 4 components supported"}</p>
      <div className={styles.coverage} aria-label="Completion coverage">{coverage.map(([label, source], index) => <div key={label} className={unreadableReplacement && index === 1 ? styles.unreadable : undefined}>{unreadableReplacement && index === 1 ? <AlertTriangle aria-hidden /> : <Check aria-hidden />}<div><strong>{label}</strong><small>{unreadableReplacement && index === 1 ? "Unreadable replacement · upload a readable FY25 workbook" : source}</small></div><span>{unreadableReplacement && index === 1 ? "Blocked" : "Supported"}</span></div>)}</div>
      <section className={styles.explanation} aria-labelledby="explanation-title"><Mail aria-hidden /><div><h4 id="explanation-title">Concentration change explanation received</h4><p>Management says the largest customer completed an acquisition, temporarily increasing reported concentration. This is a received claim until separately accepted.</p><label><input type="checkbox" checked={explanationAccepted} onChange={(event) => setExplanation(event.target.checked)} />Accept explanation as resolving F-009</label><small>{explanationAccepted ? "Explanation accepted by reviewer; this choice will be recorded separately." : "Not accepted · receiving an explanation does not dismiss the conflict."}</small></div></section>
      {unreadableReplacement && <div className={styles.failed} role="alert"><AlertTriangle aria-hidden /><div><strong>Completion blocked</strong><p>Customer_Revenue_FY25.xlsx could not be read. The prior partial decision and all first-response evidence remain inspectable.</p></div></div>}
      <div className={styles.actions}><button type="button" className={styles.primary} disabled={unreadableReplacement || status === "complete"} onClick={complete}><FileCheck2 size={17} aria-hidden />{status === "complete" ? "Complete confirmed" : "Confirm complete"}</button><button type="button" disabled={status === "complete"} onClick={() => { setStatus("partial"); onKeepOpen?.(); }}>Keep open</button><p>Only your confirmation changes the approved tracker status.</p></div>
      <aside className={styles.control}><ShieldCheck aria-hidden /><div><strong>Control request F-02 · Fully answered</strong><p>3 of 3 components supported independently · Ready for its own reviewer decision.</p></div></aside>
    </section>}
  </article>;
}
