# Engineering decisions

Record non-obvious choices as: “We chose [X] because [Y]. We rejected [Z] because [W].”

## D-001 — S01 framework versions

We chose current compatible releases resolved by npm and committed in the lockfile because S01 starts a new application on Node.js 22. We rejected undocumented floating installs in CI because reproducible checks require `npm ci`.

## D-002 — Delivery target pending confirmation

We prepared GitHub with Vercel as the intended delivery mode because it preserves the Next.js runtime capabilities required by later sessions. We rejected pretending a deployment exists because the GitHub destination, authentication and Vercel account are not available in the workspace.

## D-003 — Production bundler

We chose Next.js’s supported webpack production build because the managed workspace blocks the local worker port used by Turbopack’s CSS pipeline. We rejected an environment-specific bypass because CI and local verification should execute the same committed command.

## D-004 — Canonical previous source

We chose `Northstar_IC_Memo.pdf` page 2 as the canonical FY25 source because it is an included, inspectable fixture containing the 22% observation. We rejected calling it “CIM page 31” because no distinct CIM is included and relabelling a source would break provenance.

## D-005 — Canonical request coverage

We chose four explicit C-14 request items and one FY26 evidence link to `Customer Summary!A2:C12` because coverage must cite the actual customer schedule; `C3` remains the separate 31% observation locator. We rejected attachment counts and the single observation cell as proof of full schedule coverage.

## D-006 — Demo counts and forecast scope

We chose one canonical C-14 request plus separate complete-control and scheduling-noise messages because S02 needs consistent behavioural fixtures without claiming the PRD’s illustrative dashboard totals. We excluded the optional FY27 18% forecast claim because no forecast source is included in this minimum fixture pack.
