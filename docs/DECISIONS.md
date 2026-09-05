# Engineering decisions

Record non-obvious choices as: “We chose [X] because [Y]. We rejected [Z] because [W].”

## D-001 — S01 framework versions

We chose current compatible releases resolved by npm and committed in the lockfile because S01 starts a new application on Node.js 22. We rejected undocumented floating installs in CI because reproducible checks require `npm ci`.

## D-002 — Delivery target pending confirmation

We prepared GitHub with Vercel as the intended delivery mode because it preserves the Next.js runtime capabilities required by later sessions. We rejected pretending a deployment exists because the GitHub destination, authentication and Vercel account are not available in the workspace.

## D-003 — Production bundler

We chose Next.js’s supported webpack production build because the managed workspace blocks the local worker port used by Turbopack’s CSS pipeline. We rejected an environment-specific bypass because CI and local verification should execute the same committed command.
