# CC’d implementation plan

Created: 05 September 2026  
Status: S01–S24 implemented and passed locally; outstanding remote checkpoints are recorded per session.

Sources: [Product requirements](CC'd PRD.md) and [Brand guide](brand.md). The PRD owns behaviour and scope; the brand guide owns visual expression. Section references below refer to those documents.

This plan builds the complete synthetic, seeded application first. Each session delivers one small, reviewable increment, passes a high-level acceptance test, and reaches a verified GitHub checkpoint before the next session starts. Optional integrations and pilot work follow separately.

The project currently contains the PRD, brand guide and visual reference. There is no application scaffold or Git repository. This document is the deliverable for the planning task; it does not create a repository or deploy an application.

## 1. Session size and delivery rules

- Aim for **30–45 minutes of implementation**, **10–15 minutes of testing**, and **5–10 minutes for the GitHub checkpoint** per session.
- Stop adding scope after 45 minutes of implementation. If the acceptance criterion still needs substantial work, split the remaining work into a numbered continuation, such as S13b. A failed increment is not marked passed.
- Complete sessions in the order below. Dependencies identify the functionality that must already work; every session also builds on the last accepted checkpoint.
- Each session must leave the app runnable. Incomplete capabilities stay unexposed or explicitly labelled as prepared demo functionality. Avoid buttons that lead nowhere.
- The **24 core sessions represent roughly 18–28 hours**, including verification and publishing, before troubleshooting. These are estimates, not deadlines.
- The PRD’s four-hour schedule is a rapid hackathon path. It is not a realistic estimate for all the separate testing and GitHub gates requested here. Under a hard four-hour deadline, use the PRD’s validated cached extraction and evidence-chain fallbacks; record unfinished gates rather than declaring this plan complete.

### What “passed” means for every session

1. The listed scope works on top of the previous accepted session.
2. The session’s high-level test passes from its documented starting state.
3. The negative or recovery case passes; it does not corrupt approved state.
4. Relevant automated tests, lint, type checking and production build pass.
5. The existing cumulative smoke suite passes. Add regression tests for substantive workflows and business rules; use manual checks for simple copy or styling changes.
6. Changed UI is checked in both themes and by keyboard. Record a representative screenshot when the visible interface changes.
7. The session record, requirement coverage and known limitations are updated.
8. GitHub contains the accepted commit, passing CI and a session tag. Where a running deployment is configured, its smoke test also passes.

Passing local tests alone does not pass a session. A failed GitHub workflow or deployment leaves the session open.

### GitHub checkpoint procedure

Use `main` for accepted increments and a short branch per session, for example `session/08-baseline-intake`.

1. Start from the previous accepted commit; inspect the working tree and read the previous session handoff.
2. Implement and run the session gate locally.
3. Commit the code, tests, lockfile changes and session record together. Suggested subject: `S08: add baseline file intake and limited-coverage path`.
4. Push the branch and open a PR with the outcome, test evidence, scope references and known limitations. Do not mark unfinished acceptance criteria complete.
5. Require GitHub Actions to run installation from the lockfile, lint, type checking, domain tests, production build and the cumulative browser smoke suite. Add these checks as their harnesses become available.
6. Exercise the PR preview when available. Merge after the required checks and applicable repository review requirements pass.
7. Verify the resulting `main` commit and its deployment, then push an annotated tag such as `session-08-pass`. Tag the tested application commit, not an untested follow-up.
8. Record the commit, PR, CI run, tag and deployment URLs in the GitHub session issue or release entry. Close that issue only after the remote gate passes.

The committed session record contains the scope and local evidence; the issue/release holds final remote URLs to avoid repeatedly changing a commit just to record its own SHA.

**GitHub push and live deployment are separate checks.** A push stores the source and runs CI. A usable web URL needs a compatible host connected to the repository. In S01, record the repository owner/name, visibility, deployment target and review policy. Do not assume that a repository push creates a running Next.js app. If hosting is intentionally deferred, record that decision and label each checkpoint “GitHub published; live deployment deferred”. Never report it as a live deployment.

If a later deployment breaks, restore the last passing deployment and fix the new increment on its branch. Preserve history; do not force-push accepted checkpoints.

## 2. Build decisions and boundaries


| Area                  | Implementation direction                                                  | Reason and boundary                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Application           | Next.js, TypeScript, Tailwind, customised shadcn/ui primitives and Lucide | Follows PRD §28 and brand §14. Select compatible versions in S01 and commit the lockfile.                                                                                                                             |
| Product scope         | Synthetic Acme Capital / Project Northstar first                          | Complete the PRD’s seeded journey before any live connector.                                                                                                                                                          |
| Input contracts       | One normalised message contract and one parsed-source contract            | Seeded data, cached extraction and later live adapters must feed the same product logic.                                                                                                                              |
| Prototype persistence | Versioned browser IndexedDB behind a repository interface                 | Proposed engineering choice: each deployed visitor gets an isolated, refresh-persistent synthetic demo without a shared unauthenticated server database. PRD local JSON/lowdb remains a valid local-only alternative. |
| Persistence boundary  | One synthetic workspace per browser; no cross-device collaboration claim  | Shared team visibility is demonstrated through local personas over the same records. Real shared state and access enforcement belong to the pilot.                                                                    |
| State writes          | Domain commands with revision checks and transactional writes             | Approval must save the decision, tracker change and audit event together. Component-local state must not become the authoritative tracker.                                                                            |
| Evidence files        | Checked-in synthetic PDF/XLSX/CSV/TXT plus validated extraction caches    | Generate actual inspectable source files. Source locators must resolve against these bytes, not just a hand-written JSON summary.                                                                                     |
| Evaluation            | Deterministic rules plus schema-validated prepared extraction/evaluation  | PRD §35 explicitly allows cached structured output. A live model is optional and cannot bypass validation.                                                                                                            |
| Audit                 | SHA-256 hash chain over canonical event payloads                          | Use Web Crypto for browser persistence, or Node crypto if the store moves server-side. Verify actual records; never display a hard-coded success badge.                                                               |
| Evidence graph        | Typed nodes/edges rendered first as linked evidence-chain cards           | Keeps every source inspectable without making a graph library a release dependency.                                                                                                                                   |
| Styling               | Brand §18 tokens, complete type roles, System/Light/Dark                  | No framework colour or font defaults leaking into the product.                                                                                                                                                        |
| Testing               | Domain tests plus browser acceptance tests and targeted manual checks     | Protect source integrity and human decisions without testing every styling implementation detail.                                                                                                                     |
| Deployment            | GitHub Actions plus the hosting target selected in S01                    | Avoid relying on a deployment server’s temporary filesystem for saved decisions.                                                                                                                                      |


These are proposed implementation choices, not additional capabilities promised by the PRD. Record non-obvious changes in `docs/DECISIONS.md` using the brand’s rationale format: “We chose [X] because [Y]. We rejected [Z] because [W].”

### Product invariants

1. C-14 has **four** components: contracts, FY25 revenue, FY26 revenue and expiry dates. The first reply supports FY26 revenue only: **1 supported, 3 missing**.
2. `Customer Summary!C3` contains the FY26 31% concentration observation. Coverage of the requested FY26 customer schedule must cite the actual customer table/range, not imply that one concentration cell proves the entire schedule was supplied.
3. FY25 22% versus FY26 31% is a **nine-percentage-point change**. The potential conflict concerns management’s “stable” narrative. Different periods alone do not establish a contradiction.
4. Choose the previous-source locator from the actual prepared fixture. If it is the IC memo, show that memo and its real page. If demonstrating CIM page 31, generate and include that separate document. Never relabel one as the other.
5. Keep approved request status, processing state, proposal state, coverage state, finding state and human decision separate. Normalise PRD enum variations to one domain vocabulary, including `PARTIAL_EVIDENCE_MISSING`.
6. Ingestion can show “Response processing”; it cannot silently replace the last approved state with a proposed decision.
7. Approving partial status leaves three components missing and the potential conflict open. Closing a request or accepting an explanation requires an explicit human decision.
8. A human completeness override with missing evidence requires a reason. It records an override; it does not fabricate supporting evidence or erase the gaps.
9. Only confirmed/designated baseline claims can support high-severity comparison alerts. Failed parsing or evaluation leaves source material and the approved tracker accessible.
10. Every decision retains actor, reason where required, timestamp, before/after state and source references. Timestamps, identities and hashes come from application code, never model output.
11. Counts come from actual records. The PRD contains illustrative totals of three requests, twelve open requests and thirty-four total requests; do not combine them into an impossible dashboard. Use twelve actual awaiting requests for the scripted twelve-open demonstration, or explicitly update the demo script to match a smaller fixture.
12. Simulated signup, invitations, inbox and local personas are labelled honestly. Copying an alias is not activation; recording an invitation is not sending an email.

### Proposed project organisation

```text
src/app/                       Routes and application composition
src/components/ui/             Accessible, branded primitives
src/features/                  Onboarding, deals, baseline, requests,
                               review, evidence and activity
src/domain/                    Schemas, commands, rules and transitions
src/data/                      Repository interface and IndexedDB adapter
src/ingestion/                 Seed/live adapters, routing and matching
src/evidence/                  Parsers, source locators and validation
src/evaluation/                Structured contracts and evaluation adapters
src/audit/                     Canonical events, hashing and verification
src/styles/                    Brand tokens and typography
fixtures/northstar/            Synthetic sources and validated caches
tests/domain/                  Business-rule and data-integrity checks
tests/e2e/                     Cumulative browser acceptance checks
docs/sessions/S01.md            One record per implementation session
docs/REQUIREMENTS.md            Requirement-to-session/test ledger
docs/DECISIONS.md               Engineering decisions and scope resolutions
docs/DEMO.md                    Reset instructions and demo script
.github/workflows/ci.yml        Required remote verification
```

## 3. Core sessions

Every session below inherits the full passing and GitHub rules above. The named tag is created only after those gates pass.

### S01 — Runnable app, repository and delivery pipeline

**Depends on:** Source documents. **References:** PRD §§28, 33, 36.

**Build**

- Initialise the application and Git repository without modifying the source documents.
- Record the GitHub destination, repository visibility, hosting target and required review policy. Obtain missing destination details when executing this session.
- Add package scripts for development, lint, type checking and production build; add the first browser route smoke test.
- Add GitHub Actions, `.gitignore`, an environment-variable example with no values, and a README with exact local commands.
- Deploy a minimal CC’d shell and add the session-record and requirement-ledger templates.

**High-level test:** From a clean checkout, follow the README, open the root route, build successfully, then open the published deployment and refresh the page.

**Negative/recovery test:** Required CI must fail on a deliberate temporary type error; remove it and obtain a passing run. Confirm local environment files and credentials are excluded from Git.

**Deliverable / checkpoint:** Reproducible skeleton, working CI and documented deployment mode. `session-01-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S02 — Domain contracts and canonical demo sources

**Depends on:** S01. **References:** PRD §§18, 29, 32, 38; brand source-consistency rules.

**Build**

- Define schemas for the organisation, local user/membership, deal/access, sender policy, baseline source/claim, message, attachment, request/item, evidence, finding, proposal, decision and audit envelope.
- Separate the lifecycle fields listed in the invariants; document permitted labels and relationships.
- Prepare actual synthetic IC memo, tracker, FY26 workbook and optional forecast files. Add a source manifest and generation instructions.
- Prepare request, first reply, complete control reply and scheduling-noise messages using the same normalised envelope.
- Resolve source/count inconsistencies in `docs/DECISIONS.md`. Ensure the FY27 18% figure is backed by an included source if it appears in the demo.

**High-level test:** Validate the fixture pack; open the source workbook at C3 and the previous-source PDF at its cited page. Confirm 31% FY26, 22% FY25 and the four-component request agree with the manifest.

**Negative/recovery test:** A missing source ID, invalid locator or unknown request-item ID causes fixture validation to fail.

**Deliverable / checkpoint:** Typed contracts and a consistent, inspectable source pack. `session-02-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S03 — Persistent state, commands and audit foundation

**Depends on:** S02. **References:** PRD §§14, 22, 31, 35.

**Build**

- Implement the repository interface and versioned IndexedDB adapter with explicit load, save and migration/error states.
- Create transactional domain commands; attach actor, timestamp, revision and audit event to mutations from the start.
- Implement canonical event serialisation, SHA-256 chaining and verification before onboarding starts emitting events.
- Add deterministic demo reset and scenario loading for tests. Keep clean onboarding and a populated sample as distinct states.
- Add schema-version handling that never silently deletes an incompatible saved workspace.

**High-level test:** Create a synthetic deal through a domain command, reload the app and confirm the record and verifiable audit event remain. Reset restores the documented starting state.

**Negative/recovery test:** Simulate a failed write: the record and audit history both remain unchanged. Concurrent commands against one revision cannot both overwrite it successfully.

**Deliverable / checkpoint:** Refresh-safe demo persistence and atomic, auditable mutation infrastructure. `session-03-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S04 — Branded application shell and themes

**Depends on:** S03. **References:** Brand §§3–8, 12, 14, 15, 18.

**Build**

- Map the brand CSS tokens and full type roles into Tailwind and UI primitives.
- Self-host the specified fonts with their licence files; define loading and fallback behaviour.
- Implement the dark header, lavender context band, strong working frame and responsive page container.
- Add System/Light/Dark selection, persistent preference, skip link and visible focus treatment.
- Establish route composition for onboarding and the deal workspace. Expose navigation only as destinations become usable.

**High-level test:** Open the shell in light and dark mode at 1440px and 390px, change the theme, reload and navigate the available controls using only the keyboard.

**Negative/recovery test:** System theme and unavailable-font fallbacks preserve readable content and visible actions. Long deal names do not overflow the page.

**Deliverable / checkpoint:** Reusable brand foundation with screenshots in both themes. `session-04-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S05 — Landing page and deliberate sample entry

**Depends on:** S04. **References:** PRD §17.1.1; brand §15.1.

**Build**

- Build the product explanation, response-versus-answer demonstration, operating steps and human-approval explanation.
- Use the synthetic source pack in the product illustration and label it as an example.
- Wire “Start tracking a deal” to the signup route and “Explore a sample deal” to a minimal usable sample overview.
- Add the landing/sample-entry events to local instrumentation; returning-user entry resumes existing local state.
- Keep marketing claims within the PRD and use the exact CC’d wordmark treatment.

**High-level test:** A fresh visitor understands the illustrated partial response, selects each entry path and reaches the intended destination without a dead end.

**Negative/recovery test:** Opening the sample does not silently populate the visitor’s separate empty workspace. Returning to the landing page preserves deliberate user progress.

**Deliverable / checkpoint:** Functional acquisition and sample-entry paths. Tests: O1. `session-05-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S06 — Local signup, organisation and invitations-or-skip

**Depends on:** S05. **References:** PRD §§17.1.2–17.1.6; brand §§13, 15.2.

**Build**

- Implement simulated signup using name and email; avoid collecting a real password for local demo identity.
- Add organisation name, editable work domain, organisation type and user role fields.
- Record the creator’s organisation role separately from deal access.
- Implement locally recorded invitations and “Skip for now”, both ending at the three-way first-deal decision.
- Build the deliberate empty dashboard, including usable create-deal/sample actions and persisted onboarding progress.

**High-level test:** Create Priya and Acme Capital, skip invitations, choose the empty dashboard, reload and continue to deal creation. Repeat with a locally recorded invite.

**Negative/recovery test:** Invalid input and save failure preserve entered fields. Duplicate submission creates neither duplicate organisations nor duplicate invitations.

**Deliverable / checkpoint:** Complete local onboarding with honest simulation copy. Tests: O2–O4. `session-06-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S07 — Deal creation, alias and activation checklist

**Depends on:** S06. **References:** PRD §§17.1.7, 17.1.11–17.2; brand §14.13.

**Build**

- Implement deal configuration and deterministic unique demo alias generation; creator becomes the local deal lead.
- Display the exact selectable/copyable alias and a checklist derived from actual setup states.
- Keep baseline readiness, alias copying, activation and optional collaborators independent.
- Add a prepared activation-test message with an explicit simulated result; do not create diligence findings from it.
- Show inactive-monitoring and incomplete-setup states on the overview with working recovery actions.

**High-level test:** Create Northstar, copy its exact alias, run the prepared activation test and verify checklist progress survives a reload.

**Negative/recovery test:** An alias collision is handled deterministically. Copying alone does not mark monitoring active; failed activation offers retry or seeded-mode recovery.

**Deliverable / checkpoint:** Usable deal setup and activation state. Tests: O5, U1. `session-07-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S08 — Baseline intake and limited-coverage path

**Depends on:** S07. **References:** PRD §§17.1.8–17.1.9, 33; brand §§10, 14.3.

**Build**

- Add prepared-file selection and synthetic upload intake for PDF, XLSX, CSV and TXT, with category confirmation.
- Define configurable size/count limits and display the same limits enforced by validation.
- Hash bytes and record per-file lifecycle, duplicate, changed-version, unsupported, oversized and error states.
- Use validated cached extraction for prepared sources while live parser sessions are pending; identify unsupported extraction paths honestly.
- Add remove/retry and the explicit “Continue with limited coverage” confirmation and persistent banner.

**High-level test:** Select the prepared memo and tracker, see independent processing states, review ready files, and repeat by skipping baseline with a retained limited-coverage warning.

**Negative/recovery test:** A failed or oversized file does not discard another ready file. A renamed byte-identical file is deduplicated; changed bytes create a candidate version.

**Deliverable / checkpoint:** Recoverable baseline intake with no optional-document dead end. Tests: O6, A4–A5, A7. `session-08-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S09 — Baseline review, correction and confirmation

**Depends on:** S08. **References:** PRD §17.1.10; brand §14.12.

**Build**

- Group investment case, metrics, open requests, source versions and warnings using actual fixture counts.
- Link every presented claim to the original source page/cell through a minimal inspector.
- Add confirm, edit value/unit/period, exclude and continue-with-warning actions.
- Preserve original extraction and create correction events before accepting the reviewed baseline.
- Import tracker records idempotently and enable comparison eligibility only for confirmed/designated claims.

**High-level test:** Review the prepared sources, correct a period, exclude a claim and confirm. Reload to see the corrected baseline and the original extraction in history.

**Negative/recovery test:** Unconfirmed/excluded claims cannot trigger high-severity comparison. Confirming twice does not duplicate imported requests or audit decisions.

**Deliverable / checkpoint:** Human-confirmed, source-linked baseline. Tests: O7–O8, U6. `session-09-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S10 — Active overview and familiar request tracker

**Depends on:** S09. **References:** PRD §§17.1.13, 17.14, 17.24, 21, 25; brand §§14.4, 15.2.

**Build**

- Derive overview counts and exception summaries from persisted data; lead with limitations and decisions required.
- Build the semantic request table with ID, title, owner/requested-from, coverage, approved status, proposal indicator and due/age fields.
- Add useful sorting/filtering and retain position when returning from request detail.
- Provide request detail with original request components and baseline provenance.
- Wire Overview and Requests navigation, including empty and limited-baseline states.

**High-level test:** Open Northstar after baseline confirmation, filter an awaiting request, inspect its source and return with the same filter and position.

**Negative/recovery test:** No findings displays a truthful empty state; unknown due dates and owners remain unknown. A proposal indicator never replaces the approved status.

**Deliverable / checkpoint:** Data-driven workspace and tracker. `session-10-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S11 — Inbox simulator and deterministic ingestion

**Depends on:** S10. **References:** PRD §§17.4–17.5, 19, 33–34.

**Build**

- Implement “Receive next reply” through the normalised inbound adapter, not direct UI fixture mutation.
- Validate exact alias and sender policy before acceptance; retain quarantined/unrouted outcomes outside the tracker.
- Preserve message headers, body text, transport timestamps, source IDs and separate attachment metadata.
- Make ingestion idempotent by provider ID/content rules; show real processing steps without a fake percentage.
- Keep bodies as safe text, sanitise filenames and enforce message/file limits. Use an Atlas routing fixture for tests without adding a second-deal product surface.

**High-level test:** Receive the authorised reply and verify it routes to Northstar with one body source and one attachment source; ingest it again and get no duplicate domain records.

**Negative/recovery test:** Unknown alias, unknown sender and mismatched deal context cannot contaminate Northstar. Scheduling/test mail creates no diligence finding. Duplicate attempts may appear in diagnostics, but do not append duplicate domain events.

**Deliverable / checkpoint:** Safe seeded inbox with deterministic routing and replay protection. Tests: R1–R5. `session-11-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S12 — Request extraction and reply matching

**Depends on:** S11. **References:** PRD §§17.3, 20, 32.

**Build**

- Process the prepared outgoing request into one parent request with four stable requested-item IDs.
- Use validated structured extraction; preserve its source and confidence and reject unknown relationships.
- Match replies using `In-Reply-To`, provider thread and `References`; explicit-ID or content ambiguity stays a suggested match.
- Reconcile an imported tracker C-14 with its originating email without creating a second C-14.
- Add minimal confirm/correct-match controls and distinguish the request-created-from-email scenario from imported-baseline linkage in the demo.

**High-level test:** From a no-tracker baseline, ingest the request and then its reply: C-14 is created without retyping and the reply links automatically. Repeat against imported C-14 and confirm only one request exists.

**Negative/recovery test:** A new ambiguous thread or one response covering multiple requests requires confirmation; it cannot silently update an arbitrary row.

**Deliverable / checkpoint:** Email-derived requests and traceable response matching. Tests: T1–T2, U2–U3. `session-12-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S13 — Workbook parsing and addressable evidence

**Depends on:** S12. **References:** PRD §§17.6.5, 18.5, 32; brand §14.10.

**Build**

- Implement the workbook parser behind the existing parsed-source contract.
- Preserve sheet names, headers, table ranges, raw/displayed values, units, periods and formula provenance.
- Extract the FY26 customer schedule and the 31% concentration observation at `Customer Summary!C3`.
- Read cached formula results where present; do not execute macros, formulas or external workbook links. Missing cached values stay unresolved.
- Verify prepared cached extraction against source hashes and actual locator contents before fallback use.

**High-level test:** Parse the prepared workbook from its bytes, inspect the FY26 table and C3, and confirm the displayed 31% and raw 0.31 are correctly related.

**Negative/recovery test:** Invalid sheet/cell references fail validation. A formula with no cached result and a parser failure cannot become evidence of completeness.

**Deliverable / checkpoint:** Real workbook extraction with trustworthy cell/range provenance. Tests: T3, A2, A10, U5. `session-13-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S14 — PDF, CSV and TXT parsing

**Depends on:** S13. **References:** PRD §§17.6.3–17.6.6, 34, 35.

**Build**

- Implement PDF text extraction with actual page boundaries and source excerpts.
- Implement CSV header/row/column and TXT line-range locators.
- Reuse these parsers for baseline and incoming attachments through the same contracts.
- Distinguish scanned/OCR-required, password-protected, unsupported and parse-failed results.
- Retain successful file results during partial failure; allow only source-hash-matched validated caches as a fallback.

**High-level test:** Parse one prepared file of each type and open its cited page, row/column or line range. Confirm a CSV without FY25 data cannot support FY25 revenue.

**Negative/recovery test:** A password-protected or scanned PDF remains visibly unreadable; a ZIP remains unsupported and is never inferred to contain requested evidence.

**Deliverable / checkpoint:** Four supported source formats with explicit failure states. Tests: A1, A3, A6–A7, U6. `session-14-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S15 — Coverage evaluation and potential-conflict rules

**Depends on:** S14. **References:** PRD §§17.7–17.9, 22, 32; brand §§11.3, 14.8, 14.11.

**Build**

- Evaluate each required component as supported, partially supported, mentioned only, irrelevant, unreadable or missing.
- Generate the partial proposal from complete coverage data while retaining the last approved tracker state.
- Compare like metrics with explicit period/unit context and calculate numeric deltas in code.
- Create a potential narrative-to-data conflict referencing the “stable” email, confirmed FY25 baseline and FY26 workbook.
- Validate all source/item IDs and locators; expose invalid-output, retry and prepared-evaluation fallback states.

**High-level test:** The first reply produces one supported component, three missing components and a nine-percentage-point comparison linked to a potential conflict. No approved status changes.

**Negative/recovery test:** Different periods without the relevant narrative do not automatically produce a contradiction. Missing attachment, unrelated file and malformed model output never imply support. The fully answered control request produces no manufactured exception.

**Deliverable / checkpoint:** Validated completeness and conflict evaluation. Tests: T4–T5, A8–A9, H1, H4–H5, U4, U7. `session-15-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S16 — Review queue and request/proposal/coverage composition

**Depends on:** S15. **References:** PRD §§17.9, 17.11; brand §§9, 14.8–14.9, 15.2.

**Build**

- Build the ranked review queue and exact-count overview entry action.
- Compose the request/thread, current-versus-proposed update and evidence regions.
- Render the four named coverage rows with explicit requested, claimed and supported information.
- Make component selection update the source context; a missing row explains the gap without inventing evidence.
- Show suggested severity and confidence independently of confirmed findings or decisions. Add evaluation and source-unavailable states.

**High-level test:** Open the C-14 exception from the overview and explain, using only the page, what was requested, what arrived, what is missing and which proposal requires review.

**Negative/recovery test:** Disabling evaluation output keeps the request, prior approved status and raw received sources readable. Selecting a missing component does not show an unrelated workbook preview.

**Deliverable / checkpoint:** Complete read-only finding review; decision controls arrive in S18. `session-16-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S17 — Full evidence inspector and provenance navigation

**Depends on:** S16. **References:** PRD §§17.11, 17.16; brand §§11.5, 14.10–14.11.

**Build**

- Implement Email, Workbook, Previous evidence and Audit inspector tabs using common source IDs.
- Show filename/version, locator, period/unit, excerpt and surrounding rows/page.
- Highlight C3 without changing displayed values or hiding table headers and formula context.
- Present the management statement and FY25/FY26 observations side by side with their separate citations.
- Add source unavailable, invalid locator, parse warning and local no-access states; preserve exact selection on return.

**High-level test:** Follow every citation in C-14 from coverage to workbook, prior PDF and original email. Open surrounding context, return and retain the same request and selected component.

**Negative/recovery test:** A unavailable source or deliberately invalid locator produces an explicit state; the app does not substitute another file or silently cite the whole document.

**Deliverable / checkpoint:** End-to-end inspectable evidence. Tests: U5–U7, U9. `session-17-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S18 — Approve, edit and reject tracker proposals

**Depends on:** S17. **References:** PRD §§14, 17.11, 21–22; brand §14.9.

**Build**

- Wire “Approve as partial” to the transactional domain command.
- Add edit-proposal and reject-proposal actions, preserving the original proposal and decision rationale.
- Update tracker, coverage links, decision records and audit atomically; derive the evidence view from those records.
- Add saving, save failure, recorded and stale-proposal states, including revision checks across browser tabs.
- Retain queue/filter context after review and show “C-14 remains open with 3 missing items”.

**High-level test:** Receive the first reply, inspect it and approve partial. Reload: tracker is partial, three components remain missing, the potential conflict remains open and the reviewer decision is present.

**Negative/recovery test:** Rejection leaves the approved tracker unchanged. Double-click, failed persistence and stale approval cannot create duplicate decisions or overwrite newer state.

**Deliverable / checkpoint:** Complete first-response human-approval loop. Tests: T6, H1, U8. `session-18-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S19 — Corrections, overrides and local escalation

**Depends on:** S18. **References:** PRD §§17.18, 17.22; brand §§13.5, 15.6.

**Build**

- Add reason-required completeness override and independent conflict dismissal/confirmation.
- Extend correction commands to evidence relevance, locator, period/unit and response mapping using shared validation.
- Preview material downstream effects; invalidate dependent evaluations and create a new proposal where needed.
- Preserve earlier accepted state until a new proposal is approved; never rewrite source bytes or historical decisions.
- Add local assignment/escalation to a seeded deal lead with an internal finding link and audit entry; no email is sent.

**High-level test:** Correct a period or mark evidence unrelated, inspect the resulting revised proposal and approve it separately. Dismiss a potential conflict with a recorded reason and escalate a different finding.

**Negative/recovery test:** Blank override/dismissal reasons are blocked. A completeness override retains all missing-evidence labels; a source correction cannot silently alter a previous approved decision.

**Deliverable / checkpoint:** Recoverable human control and correction history. Tests: H2–H3. `session-19-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S20 — Evidence chain, Activity and integrity verification

**Depends on:** S19. **References:** PRD §§17.16–17.17, 30–31; brand §14.14.

**Build**

- Render the selected finding’s evidence-chain cards from typed source and decision relationships.
- Make each node open the same underlying request, message, locator, finding or decision used by the inspector.
- Build Activity filters for sources, analysis, decisions, tracker changes, processing and errors/overrides.
- Show before/after, actor, timestamp, rationale and source links; keep hashes expandable.
- Wire on-demand verification to the real stored event chain with event count and precise failure reporting.

**High-level test:** Reconstruct C-14 from baseline through request, reply, cell, finding and approval, then verify the complete event chain successfully after reload.

**Negative/recovery test:** Tamper with a copy of an event and verify that the check identifies failure while history remains readable. An unavailable visual chain cannot block the review inspector.

**Deliverable / checkpoint:** Navigable lineage and demonstrated tamper detection. Tests: U9–U10. `session-20-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S21 — Second response and explicit completion

**Depends on:** S20. **References:** PRD §§17.13, 17.19, 21, 38.

**Build**

- Add prepared contracts PDF, FY25 workbook, expiry CSV and the follow-up explanation message.
- Reuse existing ingestion, parsing and evaluation to support the three remaining components.
- Propose “Ready to complete” while retaining the last approved partial status.
- Add “Confirm complete” and “Keep open”; make acceptance of the conflict explanation an explicit, separately recorded choice.
- Retain all first-response evidence and earlier decisions, and exercise the independent fully answered control request.

**High-level test:** Start from approved partial, receive the second reply, inspect four supported components and confirm completion. The explanation becomes accepted only through the reviewer’s explicit choice.

**Negative/recovery test:** One unreadable replacement or “Keep open” prevents ordinary completion. Receiving an explanation alone cannot dismiss the conflict. Historical partial decisions remain inspectable.

**Deliverable / checkpoint:** Complete request lifecycle beyond the five-minute partial-response demo. This session extends the minimum demo to cover the PRD’s described end-to-end flow. `session-21-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S22 — Integrated failure, isolation and recovery pass

**Depends on:** S21. **References:** PRD §§33–35, 37, 40.

**Build**

- Consolidate repeatable scenarios for unknown sender/alias, replay, no attachment, unrelated evidence, oversized/unsupported/unreadable files and malformed evaluation.
- Exercise cross-deal identifier checks and local persona restrictions without claiming production authorisation.
- Make AI/parser/connector fallbacks visible and ensure the same review UI consumes them.
- Verify safe rendering of source content, metadata preservation and recovery after interrupted processing.
- Close missing high-risk regression coverage from S08–S21 and update the requirement ledger with actual outcomes.

**High-level test:** Run a failure scenario through intake → visible failure → retry or validated fallback → review, while the last approved tracker state remains available throughout.

**Negative/recovery test:** A seeded organisation member without Northstar access sees no Northstar metadata through supported routes. Document that local storage and persona checks are demonstrative, not a security boundary for real data.

**Deliverable / checkpoint:** Reliable degraded operation and documented prototype limits. Tests: all A/R/H cases, O9 at simulation level only. `session-22-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S23 — Responsive, accessible and performance acceptance

**Depends on:** S22. **References:** Brand §§4.8, 6, 7, 10–12, 15, 18.

**Build**

- Verify three-column review at ≥1280px, two-region/expandable-thread behaviour at 768–1279px and sequential mobile review below 768px.
- Check keyboard-only navigation, labelled dialogs, focus restoration, live announcements, visible errors and screen-reader table/source structure.
- Check 200% zoom, 320px reflow, 390px mobile, 48px touch targets, long locators and sticky-action clearance.
- Verify both themes, reduced motion and forced-colour behaviour; fix observed contrast/token leakage.
- Measure first-paint font payload, shell readiness and seeded reply-processing duration; lazy-load expensive inspectors/parsers where needed.

**High-level test:** Complete C-14 review and approval on desktop and mobile, in light and dark themes, including a keyboard-only desktop pass and a screen-reader spot check.

**Negative/recovery test:** At narrow width/zoom, no decision or source is unreachable or obscured. Unavailable fonts, reduced motion and failed lazy-loaded viewers retain readable source access or an explicit recovery action.

**Deliverable / checkpoint:** Screenshots, accessibility observations and measured performance evidence. Targets: shell usable within 2 seconds on a recorded device/network; first-paint WOFF2 requests ≤180 KB; seeded response-processing sequence ≤8 seconds. Fix failures before passing or record an explicit source-requirement change. `session-23-pass`.

++***Note - Write the minimum possible code and not a plethora of files***++

### S24 — Full demo, clean-install verification and release handoff

**Depends on:** S23. **References:** PRD §§9, 36–40; all core acceptance criteria.

**Build**

- Finalise `docs/DEMO.md`: clean reset, fixture manifest, five-minute script, returning-user entry and failure recoveries.
- Resolve the baseline/imported-C-14 versus email-created-C-14 presentation: use a scenario that actually demonstrates creation, or state accurately that the original request is linked to an imported row.
- Run the complete application from a clean checkout and from the deployed URL, including refresh/deep-link and persisted-decision checks.
- Reconcile every P0 requirement and listed test against recorded results; list optional and deferred work explicitly.
- Prepare the release notes, known limitations and next-session handoff. If optional follow-up drafting is not built, omit that action from the live script and record the P1 omission.

**High-level test:** A reviewer follows landing → signup → organisation → skip invitations → deal → baseline confirmation → activation → request → first reply → four-component review → exact sources → approve partial → updated tracker → evidence chain → verified audit. Repeat from a fresh reset, then verify the second-response completion scenario.

**Negative/recovery test:** Repeat the critical review with the model unavailable and with a parser failure; raw sources and approved state remain usable and fallback labels are accurate. Confirm a scheduling message and complete control response do not manufacture exceptions.

**Deliverable / checkpoint:** Accepted seeded application, complete test ledger and reproducible demo. `session-24-pass`, followed by an annotated `v0.1.0-demo` release tag on the accepted commit.

++***Note - Write the minimum possible code and not a plethora of files***++

## 4. Optional sessions after the core passes

These sessions follow the same size limit, acceptance gate and GitHub procedure. They are separate choices, not hidden prerequisites for S24. All external sending remains subject to explicit authorisation when executing the work.


| Session                              | Scope and dependency                                                                                                                                  | High-level acceptance test                                                                                      | Negative/recovery test                                                                                                                          | Checkpoint          |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| E01 — Follow-up draft                | After S24: editable subject/body grounded in missing components and conflict sources; copy only. PRD §§15 P1, 17.12.                                  | Generate a draft from approved partial and copy an edited version containing the three missing components.      | Copying does not send mail, complete C-14 or resolve its conflict; no invented recipients or evidence.                                          | `extension-01-pass` |
| E02 — Alert and daily-brief previews | After S24: email-styled exception preview and source-linked daily brief generated from real demo state.                                               | Open a partial/conflict preview and follow its link to the exact finding; “ready to close” differs from closed. | Routine scheduling/ingestion produces no exception alert; no delivery claim for previews.                                                       | `extension-02-pass` |
| E03 — Second deal and tracker export | After S24: visible Atlas workspace using existing routing separation; copied/downloadable internal tracker.                                           | Route Atlas/Northstar fixtures correctly and export the selected deal’s approved state and provenance.          | No cross-deal data leakage; proposed changes are labelled; exported user/source text cannot become executable spreadsheet formula content.      | `extension-03-pass` |
| E04 — Gmail test connector           | After S24: read-only narrow test-mailbox integration using the seeded message contract, cursor and retry/deduplication. Credentials stay server-side. | A test message copied to the configured alias follows the same evidence/approval flow.                          | Revoked access, duplicate delivery and network failure preserve approved state and permit seeded fallback. No whole-company mailbox processing. | `extension-04-pass` |
| E05 — Live structured evaluation     | After S24: selected model adapter, schema/locator checks, timeout and source-grounded output handling.                                                | Evaluate the prepared reply and obtain the same validated coverage and potential-conflict result.               | Invented locators, prompt instructions embedded in source text, malformed output and timeouts cannot mutate approved state.                     | `extension-05-pass` |
| E06 — Interactive graph              | After S24: replace/enhance evidence-chain presentation only if it improves inspection.                                                                | Every graph node opens the same source/decision as the existing cards.                                          | Keyboard and mobile users retain the full card-based inspection path if the graph fails.                                                        | `extension-06-pass` |
| E07 — Baseline version comparison    | After S24: current/candidate comparison, deterministic deltas, make-current decision and supersession history. PRD §17.21.                            | Review a changed forecast, designate its version current, then approve material extracted claims separately.    | New filename/time alone never supersedes a source; previous locators remain inspectable.                                                        | `extension-07-pass` |
| E08 — Archive and reactivation       | After S24: explicit archive reason/policy, read-only history, paused ingestion and local authorised reactivation. PRD §17.26.                         | Archive Northstar, receive a prepared message under the selected stop/quarantine policy, then reactivate.       | Archived messages cannot silently update the tracker; reactivation does not replay rejected messages automatically.                             | `extension-08-pass` |


Functional invitation delivery in PRD P1 is scheduled with real identity and access in the pilot below; sending an invitation without an enforceable acceptance/access boundary is not a meaningful completed feature.

## 5. Pilot and later work: tracked, not implied complete

The detailed PRD includes production flows beyond its explicit P0 feature list. Track these now so they are not lost, but do not expose prototype simulation as implemented security. Pilot sessions need a fresh estimate after deployment, identity, storage and provider decisions are made. Each row below is a starting slice and must be split if it exceeds the session limit.


| Session                                       | Work and prerequisites                                                                                                                               | High-level test before GitHub checkpoint                                                                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P01 — Durable shared records                  | Select database/object storage and hosting; implement repository adapter and transactional state/audit writes. Requires an agreed pilot environment. | Two authorised sessions observe the same accepted change after server restart; failed writes cannot split decisions from audit.                                           |
| P02 — Real authentication and tenant boundary | Integrate identity and enforce organisation/deal access on every server read/write/download.                                                         | Wrong-tenant and unauthorised direct requests return no protected metadata; authorised user can resume normally.                                                          |
| P03 — Organisation invitations                | Create/send explicitly authorised invitation, token lifecycle and matching-email acceptance. Depends on P02.                                         | Existing/new user accepts without duplicate organisation; expired, revoked and wrong-email tokens fail safely. PRD O10.                                                   |
| P04 — Deal access management                  | Lead/member/viewer policies, add/remove access and lead transfer. Depends on P03.                                                                    | Removal blocks an already-open session’s future reads/writes; historical actor remains; last lead cannot be removed. O9 is now a real security test.                      |
| P05 — Notification preferences and delivery   | Authorised outbound service, preference persistence, timezone/digest scheduling and deduplication.                                                   | A staged material alert reaches only the intended reviewer; muting alerts leaves ingestion/audit running.                                                                 |
| P06 — Pilot file/data controls                | Retention/deletion, access logs, restricted uploads and malware-scanning integration; split implementation by control.                               | Validate each configured control using staged files/data and record failure behaviour. No real deal-data onboarding before the required production controls are accepted. |
| P07 — External tracker sync                   | Choose exactly one target and define conflict/ownership semantics before coding.                                                                     | Approved change syncs once; concurrent external edit surfaces a conflict; failed sync retries without duplication.                                                        |
| P08 — Product feedback and pilot validation   | Instrument approved reconciliation rate and correction/rejection feedback; conduct the PRD §42 validation with consent.                              | Metrics reconcile to underlying decisions and interviews address the listed adoption/kill signals.                                                                        |


Outlook, Teams, Slack, VDR, OCR, additional document formats, cross-document analysis beyond E07, IC-readiness reporting, portfolio views and policy-controlled automation remain V2/backlog. Each needs a scoped plan and acceptance criteria before implementation. Autonomous external sending remains outside the current product scope.

## 6. Requirements and test coverage ledger

Create `docs/REQUIREMENTS.md` in S01 using this mapping. Replace “planned” with actual test names/results as sessions pass. A deferred requirement must retain its phase and reason; an unimplemented production test is never recorded as passed by a simulation.


| Requirement / existing PRD test                   | Owning session(s)               | Release evidence                                                               |
| ------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| P0 1: onboarding; O1–O4                           | S05–S06                         | Browser journey including invitation skip and empty dashboard                  |
| P0 2, 5: deal, alias, workspace; O5, U1           | S07, S10                        | Alias/copy/activation and overview checks                                      |
| P0 3–4: baseline; O6–O8                           | S08–S09, S13–S14                | Limited-coverage, correction and provenance tests                              |
| P0 6–7: seeded inbox/routing; R1–R5               | S11                             | Exact alias, sender, cross-deal and replay checks                              |
| P0 8–9: extraction/matching; T1–T2, U2–U3         | S12                             | Request-from-email, import deduplication and ambiguity cases                   |
| P0 10: PDF; A1, A6, U6                            | S14, S17                        | Page-based source and unreadable-file checks                                   |
| P0 11: XLSX; T3, A2, A10, U5                      | S13, S17                        | Real cell/range, raw/display value and formula checks                          |
| P0 file formats/versions; A3–A5, A7               | S08, S14                        | CSV coverage, binary hash, version and unsupported tests                       |
| P0 12: completeness; T4, A8–A9, U4                | S15                             | Missing/irrelevant evidence and 1-of-4 coverage                                |
| P0 13: conflict; T5, U7                           | S15, S17                        | Period-aware 22%/31% comparison and narrative evidence                         |
| P0 14: review queue                               | S16                             | Ranked, source-linked exceptions with true counts                              |
| P0 15: decisions; T6, H1–H3, U8                   | S18–S19, S21                    | Partial, edit/reject, override, dismissal and explicit closure                 |
| Invalid/failed evaluation; H4–H5                  | S15, S22                        | Rejected nonexistent locator; approved state survives failure                  |
| P0 16: audit; U10                                 | S03, S20                        | Atomic writes, replay checks and tamper-detection evidence                     |
| P0 17: graph/lineage; U9                          | S20                             | Clickable evidence-chain cards, optional E06 graph                             |
| Brand typography, tokens, bold frame, both themes | S04, every UI session, S23      | Visual evidence and token/contrast review                                      |
| Brand source formatting, en-GB and exact locators | S09–S20, S23                    | Period, precision, source-text and timezone checks                             |
| Brand responsive/a11y/performance targets         | S23                             | Viewports, keyboard/screen reader, font and timing measurements                |
| P0 synthetic-data and safe-ingestion rules        | S01, S08, S11, S13–S14, S22     | Secret exclusion, restricted inputs and safe source rendering                  |
| Source correction and stale proposal handling     | S03, S18–S19                    | Concurrency and dependent-evaluation invalidation tests                        |
| Second reply / full completion                    | S21                             | Four supported components and separate explanation decision                    |
| PRD §26 instrumentation                           | S05–S21 at feature introduction | Events carry actual IDs and outcomes; duplicate commands do not inflate counts |
| Demo, degradation and repeatability               | S24                             | Two clean rehearsals, control/noise threads and failed-dependency run          |
| Draft/alerts/brief/second deal/export             | E01–E03                         | Explicit P1 extension checks                                                   |
| Live connector/model and optional graph           | E04–E06                         | Adapter/fallback and parity checks                                             |
| Source version designation / archive              | E07–E08                         | Preserved history and explicit lifecycle decisions                             |
| O9 access denial                                  | S22 simulated; P02/P04 enforced | Distinguish local demo check from server security test                         |
| O10 real invitation acceptance                    | P03                             | Delivered invitation and identity-bound acceptance                             |
| Production roles, preferences, retention and sync | P01–P07                         | Pilot gates, not a V0 claim                                                    |


### Cumulative high-level smoke suite

Add these journeys when their dependencies are built, then run them at every later checkpoint:


| Available after | Journey                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| S01             | Application boots from a clean installation and the published route refreshes.                          |
| S06             | Landing → local signup → organisation → skip invitations → deliberate empty dashboard.                  |
| S09             | Create deal → copy alias → prepared baseline → correction → confirmation → reload.                      |
| S12             | Receive outgoing request → create/link C-14 → receive matching reply → no duplicate request.            |
| S15             | First reply → 1 supported / 3 missing → period-aware potential conflict → unchanged approved status.    |
| S18             | Inspect evidence → approve partial → refresh → partial remains, conflict still open, decision recorded. |
| S20             | Follow source/decision lineage → verify chain; tampered test copy fails verification.                   |
| S21             | Second reply → ready to complete → explicit human closure with separately accepted explanation.         |
| S22             | Unreadable or failed evaluation → raw source available → tracker unchanged → recover.                   |
| S23             | Canonical approval remains usable at mobile width and with keyboard navigation.                         |


## 7. Session handoff template

Use the same template for every session, including continuations and extensions.

```markdown
# SXX — Session title

Status: Not started | In progress | Gate failed | Passed
Previous accepted tag:
Source requirements:
Starting scenario / reset command:

## Intended outcome
One observable user or system outcome.

## Changes delivered
- Implementation and relevant paths.
- Decisions made, with rationale.

## Acceptance evidence
- High-level scenario, expected result, actual result.
- Negative/recovery case and actual result.
- Commands run and outcomes.
- Relevant screenshots and measurements.
- Requirements/tests added or updated.

## GitHub checkpoint
- Branch and intended tag.
- Session issue/release URL holding final commit, PR, CI and deployment links.
- Deployment mode: live URL / explicitly deferred.

## Remaining work
- Failures/blockers, if any.
- Explicitly deferred scope and owning session.
- Exact next session and starting state.
```

## 8. V0 release acceptance checklist

- [ ] All 24 core sessions have passing GitHub checkpoints, or an explicit recorded scope revision replaces a session.
- [ ] Every P0 feature and O1–O8, T1–T6, A1–A10, R1–R5 and H1–H5 has actual acceptance evidence.
- [ ] O9’s prototype limitation and O10’s pilot deferral are clearly recorded.
- [ ] Canonical C-14 data, source locators, periods and all visible counts agree with the source fixtures.
- [ ] Approved state remains distinct from processing/proposals; material decisions require human action.
- [ ] Partial approval leaves three evidence gaps and the potential conflict open.
- [ ] Original sources, corrections, decisions and failed processing remain inspectable.
- [ ] The audit verification badge is computed and a tampered chain is detected.
- [ ] Both themes, responsive review, keyboard operation and performance targets have recorded checks.
- [ ] No credentials, real deal files, unlabelled simulated delivery or production-security claims enter the release.
- [ ] The app works from a clean checkout and the actual deployment mode is documented accurately.
- [ ] Reset, five-minute demo and dependency-failure recovery work from the release commit.
- [ ] Optional and pilot work remains visible in the ledger, with no unfinished functionality presented as complete.
