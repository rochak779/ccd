"use client";

import { ArrowRight, Building2, Check, FlaskConical, Plus, Trash2, Users } from "lucide-react";
import { FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { Button, Field, SelectField } from "@/components/ui/controls";
import { AppShell } from "@/features/shell/app-shell";
import styles from "./onboarding.module.css";

export type OnboardingStep = "account" | "organisation" | "invitations" | "begin" | "dashboard";
export type Invitation = { email: string; role: "ADMIN" | "MEMBER"; status: "DRAFT" | "SENT" };
export type OnboardingState = {
  step: OnboardingStep;
  user?: { fullName: string; email: string };
  organisation?: { name: string; domain: string; type: string; userRole: string; creatorOrganisationRole: "ADMIN" };
  invitations: Invitation[];
  invitationsSkipped: boolean;
};
export type OnboardingEvent = "FIRST_DEAL_STARTED" | "SAMPLE_DEAL_OPENED" | "FIRST_DEAL_DEFERRED";

const DEFAULT_STATE: OnboardingState = { step: "account", invitations: [], invitationsSkipped: false };
const STORAGE_KEY = "ccd-onboarding-v1";

export function OnboardingFlow({ initialState, persist, createDealHref = "/deals/new", sampleHref = "/sample", onStateChange, onEvent }: { initialState?: Partial<OnboardingState>; persist?: (state: OnboardingState) => Promise<void>; createDealHref?: string; sampleHref?: string; onStateChange?: (state: OnboardingState) => void; onEvent?: (event: OnboardingEvent) => void }) {
  const [state, setState] = useState<OnboardingState>({ ...DEFAULT_STATE, ...initialState });
  const [saveError, setSaveError] = useState("");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    if (initialState) return;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) queueMicrotask(() => setState({ ...DEFAULT_STATE, ...JSON.parse(saved) as OnboardingState }));
    } catch { queueMicrotask(() => setSaveError("Saved setup could not be read. Your entries on this screen are still available.")); }
  }, [initialState]);

  async function commit(next: OnboardingState) {
    if (busyRef.current) return false;
    busyRef.current = true; setBusy(true); setSaveError("");
    try {
      if (persist) await persist(next); else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setState(next); onStateChange?.(next); return true;
    } catch {
      setSaveError("We could not save this step. Check your connection and try again; your entries have been preserved.");
      return false;
    } finally { busyRef.current = false; setBusy(false); }
  }

  const titles: Record<OnboardingStep, string> = { account: "Create your CC’d account", organisation: "Set up your organisation", invitations: "Invite your team", begin: "How would you like to begin?", dashboard: `Welcome to ${state.organisation?.name ?? "your workspace"}` };
  return (
    <AppShell title={titles[state.step]} context={<span className={styles.simulated}><FlaskConical aria-hidden="true" size={16} />Prepared local prototype</span>} accountLabel={state.user?.fullName}>
      <div className={styles.frame}>
        {saveError ? <div className={styles.errorBanner} role="alert"><strong>Setup was not saved.</strong><span>{saveError}</span></div> : null}
        {state.step === "account" ? <AccountStep state={state} busy={busy} commit={commit} /> : null}
        {state.step === "organisation" ? <OrganisationStep state={state} busy={busy} commit={commit} /> : null}
        {state.step === "invitations" ? <InvitationsStep state={state} busy={busy} commit={commit} /> : null}
        {state.step === "begin" ? <BeginStep state={state} busy={busy} commit={commit} createDealHref={createDealHref} sampleHref={sampleHref} onEvent={onEvent} /> : null}
        {state.step === "dashboard" ? <EmptyDashboard state={state} createDealHref={createDealHref} sampleHref={sampleHref} /> : null}
      </div>
    </AppShell>
  );
}

function AccountStep({ state, busy, commit }: StepProps) {
  const [fullName, setFullName] = useState(state.user?.fullName ?? "");
  const [email, setEmail] = useState(state.user?.email ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(event: FormEvent) {
    event.preventDefault(); const nextErrors: Record<string, string> = {};
    if (!fullName.trim()) nextErrors.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    setErrors(nextErrors); if (Object.keys(nextErrors).length) return;
    await commit({ ...state, user: { fullName: fullName.trim(), email: email.toLowerCase().trim() }, step: "organisation" });
  }
  const personal = /@(gmail|outlook|hotmail|yahoo)\./i.test(email);
  return <StepLayout index={1} note="Authentication is simulated for this local prototype. No password is collected."><form onSubmit={submit} noValidate><Field name="fullName" label="Full name" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} /><Field name="email" label="Work email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} hint={personal ? "You can continue, though a work email is recommended." : undefined} /><Button type="submit" busy={busy}>Create account</Button></form></StepLayout>;
}

function OrganisationStep({ state, busy, commit }: StepProps) {
  const emailDomain = state.user?.email.split("@")[1] ?? "";
  const suggestedName = emailDomain ? emailDomain.split(".")[0].replace(/^./, (v) => v.toUpperCase()) : "";
  const [name, setName] = useState(state.organisation?.name ?? suggestedName);
  const [domain, setDomain] = useState(state.organisation?.domain ?? emailDomain);
  const [type, setType] = useState(state.organisation?.type ?? "private-equity");
  const [userRole, setUserRole] = useState(state.organisation?.userRole ?? "associate");
  const [confirmDifferentDomain, setConfirmDifferentDomain] = useState(false);
  const [error, setError] = useState("");
  const differs = Boolean(emailDomain && domain && emailDomain !== domain.toLowerCase());
  async function submit(event: FormEvent) { event.preventDefault(); if (!name.trim() || !domain.trim()) { setError("Enter an organisation name and work domain."); return; } if (differs && !confirmDifferentDomain) { setError("Confirm that the different work domain is intentional."); return; } setError(""); await commit({ ...state, organisation: { name: name.trim(), domain: domain.trim().toLowerCase(), type, userRole, creatorOrganisationRole: "ADMIN" }, step: "invitations" }); }
  return <StepLayout index={2} note="Organisation membership is separate from access to individual deals."><form onSubmit={submit}><Field name="organisationName" label="Organisation name" value={name} onChange={(e) => setName(e.target.value)} /><Field name="workDomain" label="Work domain" value={domain} onChange={(e) => { setDomain(e.target.value); setConfirmDifferentDomain(false); }} hint={differs ? `This differs from ${emailDomain}.` : "Used as one sender-verification signal; it can be edited."} />{differs ? <label className={styles.confirm}><input type="checkbox" checked={confirmDifferentDomain} onChange={(e) => setConfirmDifferentDomain(e.target.checked)} /><span>I confirm this work domain is intentional.</span></label> : null}<div className={styles.fieldPair}><SelectField name="organisationType" label="Organisation type" value={type} onChange={(e) => setType(e.target.value)}><option value="private-equity">Private equity</option><option value="private-credit">Private credit</option><option value="venture-capital">Venture capital</option><option value="family-office">Family office</option><option value="other">Other</option></SelectField><SelectField name="userRole" label="Your role" value={userRole} onChange={(e) => setUserRole(e.target.value)}><option value="associate">Analyst / associate</option><option value="senior-associate">Senior associate</option><option value="vp-director">VP / director</option><option value="partner">Partner</option><option value="operations">Operations</option><option value="other">Other</option></SelectField></div>{error ? <p className={styles.fieldError} role="alert">{error}</p> : null}<Button type="submit" busy={busy}>Create organisation</Button></form></StepLayout>;
}

function InvitationsStep({ state, busy, commit }: StepProps) {
  const [rows, setRows] = useState<Invitation[]>(state.invitations.length ? state.invitations : [{ email: "", role: "MEMBER", status: "DRAFT" }]);
  const [error, setError] = useState("");
  function update(index: number, patch: Partial<Invitation>) { setRows((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, ...patch } : row)); }
  async function send(event: FormEvent) { event.preventDefault(); const valid = rows.filter((row) => row.email.trim()); if (!valid.length || valid.some((row) => !/^\S+@\S+\.\S+$/.test(row.email))) { setError("Enter at least one valid email address, or skip for now."); return; } const unique = [...new Map(valid.map((row) => [row.email.toLowerCase(), { ...row, email: row.email.toLowerCase(), status: "SENT" as const }])).values()]; setError(""); await commit({ ...state, invitations: unique, invitationsSkipped: false, step: "begin" }); }
  return <StepLayout index={3} note="Invitations are recorded locally for this prototype. No email is sent, and organisation membership does not grant access to every deal."><form onSubmit={send}><div className={styles.inviteRows}>{rows.map((row, index) => <div className={styles.inviteRow} key={index}><Field name={`invite-${index}`} label={`Invitee ${index + 1} email`} type="email" value={row.email} onChange={(e) => update(index, { email: e.target.value })} /><SelectField name={`role-${index}`} label="Organisation role" value={row.role} onChange={(e) => update(index, { role: e.target.value as Invitation["role"] })}><option value="MEMBER">Member</option><option value="ADMIN">Admin</option></SelectField>{rows.length > 1 ? <Button type="button" variant="ghost" aria-label={`Remove invitee ${index + 1}`} onClick={() => setRows((current) => current.filter((_, rowIndex) => rowIndex !== index))}><Trash2 aria-hidden="true" size={18} />Remove</Button> : null}</div>)}</div><Button type="button" variant="secondary" onClick={() => setRows((current) => [...current, { email: "", role: "MEMBER", status: "DRAFT" }])}><Plus aria-hidden="true" size={18} />Add another</Button>{error ? <p className={styles.fieldError} role="alert">{error}</p> : null}<div className={styles.formActions}><Button type="submit" busy={busy}>Record invitations</Button><Button type="button" variant="ghost" disabled={busy} onClick={() => commit({ ...state, invitations: [], invitationsSkipped: true, step: "begin" })}>Skip for now</Button></div></form></StepLayout>;
}

function BeginStep({ state, busy, commit, createDealHref, sampleHref, onEvent }: StepProps & { createDealHref: string; sampleHref: string; onEvent?: (event: OnboardingEvent) => void }) {
  const options = [{ title: "Create my first deal", body: "Set up a real workspace and receive a deal-specific CC address.", href: createDealHref, primary: true, icon: Building2, event: "FIRST_DEAL_STARTED" as const }, { title: "Explore Project Northstar", body: "See a complete synthetic example without adding deal information.", href: sampleHref, icon: FlaskConical, event: "SAMPLE_DEAL_OPENED" as const }];
  return <StepLayout index={4} note="Choose a path deliberately. The sample remains separate from your organisation workspace."><div className={styles.choices}>{options.map(({ title, body, href, primary, icon: Icon, event }) => <a className={primary ? styles.primaryChoice : styles.choice} href={href} key={title} onClick={() => onEvent?.(event)}><Icon aria-hidden="true" size={24} /><span><strong>{title}</strong><small>{body}</small></span><ArrowRight aria-hidden="true" size={20} /></a>)}<button className={styles.choice} type="button" disabled={busy} onClick={async () => { if (await commit({ ...state, step: "dashboard" })) onEvent?.("FIRST_DEAL_DEFERRED"); }}><Users aria-hidden="true" size={24} /><span><strong>Go to empty dashboard</strong><small>Create a deal later and keep your organisation setup.</small></span><ArrowRight aria-hidden="true" size={20} /></button></div></StepLayout>;
}

function EmptyDashboard({ state, createDealHref, sampleHref }: { state: OnboardingState; createDealHref: string; sampleHref: string }) {
  return <div className={styles.dashboard}><section className={styles.empty}><Building2 aria-hidden="true" size={32} /><h2>No deals are being tracked yet.</h2><p>Create a deal to establish a baseline, receive a secure CC address and start tracking responses and evidence.</p><div className={styles.formActions}><a className={styles.primaryAction} href={createDealHref}>Create first deal<ArrowRight aria-hidden="true" size={18} /></a><a className={styles.secondaryAction} href={sampleHref}>Explore sample deal</a></div></section><aside><h2>Workspace setup</h2>{state.invitationsSkipped ? <p className={styles.task}><Users aria-hidden="true" size={20} /><span><strong>Invite collaborators when you are ready</strong><small>This optional task does not block deal creation.</small></span></p> : <p className={styles.task}><Check aria-hidden="true" size={20} /><span><strong>{state.invitations.length} invitation{state.invitations.length === 1 ? "" : "s"} recorded locally</strong><small>No invitation email was sent.</small></span></p>}<h3>How CC’d works</h3><ol><li>Establish a confirmed baseline.</li><li>CC the unique deal address.</li><li>Review source-linked proposals.</li></ol><a className={styles.settings} href="/settings/organisation">Organisation settings</a></aside></div>;
}

type StepProps = { state: OnboardingState; busy: boolean; commit: (state: OnboardingState) => Promise<boolean> };
function StepLayout({ index, note, children }: { index: number; note: string; children: ReactNode }) { return <section className={styles.step}><div className={styles.stepNote}><span>Step {index} of 4</span><p>{note}</p></div><div className={styles.formSurface}>{children}</div></section>; }
