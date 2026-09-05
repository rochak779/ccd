"use client";

import { ArrowRight, Check, FileSpreadsheet, Mail, ShieldCheck, TriangleAlert } from "lucide-react";
import { AppShell } from "@/features/shell/app-shell";
import styles from "./landing.module.css";

export type LandingEvent = "landing_primary_cta_clicked" | "sample_deal_clicked" | "signin_clicked";

export function LandingPage({ signupHref = "/signup", sampleHref = "/sample", signInHref = "/signin", resumeHref, onEvent }: { signupHref?: string; sampleHref?: string; signInHref?: string; resumeHref?: string; onEvent?: (event: LandingEvent) => void }) {
  const primaryHref = resumeHref ?? signupHref;
  return (
    <AppShell accountLabel="Evidence-linked diligence">
      <section className={styles.hero} aria-labelledby="landing-title">
        <div className={styles.pitch}>
          <h1 id="landing-title">The diligence tracker you keep in the loop.</h1>
          <p>CC the deal-specific address on the emails your team already sends. CC’d checks replies and attachments, flags missing or conflicting evidence, and proposes a tracker update for your team to approve.</p>
          <div className={styles.actions}>
            <a className={styles.primaryLink} href={primaryHref} onClick={() => onEvent?.("landing_primary_cta_clicked")}>{resumeHref ? "Continue setup" : "Start tracking a deal"}<ArrowRight aria-hidden="true" size={18} /></a>
            <a className={styles.secondaryLink} href={sampleHref} onClick={() => onEvent?.("sample_deal_clicked")}>Explore a sample deal</a>
            <a className={styles.signIn} href={signInHref} onClick={() => onEvent?.("signin_clicked")}>Sign in</a>
          </div>
        </div>
        <NorthstarProof />
      </section>

      <ul className={styles.proofStrip} aria-label="Product qualities"><li>Email-native</li><li>Attachment-aware</li><li>Human-approved</li><li>Source-linked</li></ul>

      <section className={styles.sequence} aria-labelledby="sequence-title">
        <h2 id="sequence-title">One familiar thread. A defensible record.</h2>
        <ol>
          <li><strong>Establish the baseline once.</strong><span>Confirm the investment case, key metrics and open requests from the sources you already use.</span></li>
          <li><strong>CC the deal in ordinary email.</strong><span>A unique deal address routes the thread without scanning your whole mailbox.</span></li>
          <li><strong>Review what the evidence supports.</strong><span>Approve, edit or reject a source-linked proposal. Material tracker state never changes silently.</span></li>
        </ol>
      </section>

      <section className={styles.control} aria-labelledby="control-title">
        <div><ShieldCheck aria-hidden="true" size={24} /><h2 id="control-title">The proposal is not the decision.</h2></div>
        <p>CC’d can show that a response is partial and point to the supporting workbook range. Your team still decides what belongs in the approved tracker, with the source and decision history kept beside it.</p>
      </section>

      <section className={styles.scope} aria-labelledby="scope-title">
        <h2 id="scope-title">Built around inspectable evidence.</h2>
        <div><p><strong>Prepared prototype scope</strong></p><p>PDF, XLSX, CSV and TXT sources; explicit baseline gaps; an internal request tracker; and simulated local account and invitation flows.</p></div>
        <div><p><strong>Deliberate boundaries</strong></p><p>No whole-mailbox surveillance, automatic email sending, silent material closure or external Excel synchronisation.</p></div>
      </section>

      <footer className={styles.footer}><span>CC’d</span><span>A response is an event. An answer is a verified state.</span><a href={primaryHref}>{resumeHref ? "Continue setup" : "Start tracking a deal"}</a></footer>
    </AppShell>
  );
}

function NorthstarProof() {
  const coverage = [{ label: "Top ten customer contracts", supported: false }, { label: "Revenue by customer FY25", supported: false }, { label: "Revenue by customer FY26", supported: true }, { label: "Current contract expiry dates", supported: false }];
  return (
    <div className={styles.demo} aria-label="Synthetic Project Northstar example">
      <div className={styles.demoTop}><span>Synthetic example · Project Northstar</span><span>Request C-14</span></div>
      <div className={styles.incoming}><Mail aria-hidden="true" size={20} /><div><strong>Management replied</strong><span>Customer_Revenue_FY26.xlsx attached</span></div><FileSpreadsheet aria-hidden="true" size={20} /></div>
      <div className={styles.result}><div><span>Proposed status</span><strong>Partial — evidence missing</strong></div><span className={styles.conflict}><TriangleAlert aria-hidden="true" size={16} />1 potential conflict</span></div>
      <ul className={styles.coverage}>{coverage.map((item) => <li key={item.label} className={item.supported ? styles.supported : styles.missing}><span aria-hidden="true">{item.supported ? <Check size={14} /> : "—"}</span><span>{item.label}</span><strong>{item.supported ? "Supported" : "Missing"}</strong></li>)}</ul>
      <div className={styles.comparison}><span>Source-linked comparison</span><strong>FY25 22% <ArrowRight aria-hidden="true" size={16} /> FY26 31% <em>+9 pp</em></strong><small>Previous IC memo · Customer Summary!C3</small></div>
    </div>
  );
}
