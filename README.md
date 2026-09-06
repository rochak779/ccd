# CC’d

CC’d turns ordinary diligence email into an evidence-linked tracker proposal while keeping material decisions with a human reviewer. The repository contains the runnable foundation and S02’s typed contracts and synthetic source pack.

## Requirements

- Node.js 22
- npm 10 or later

## Run locally

From a clean checkout:

```bash
cp .env.example .env.local
npm ci
npx playwright install chromium
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Stop the development server with `Ctrl+C`.

Routes: `/` landing, `/signup` local onboarding, `/deals/new` deal setup and `/sample` the synthetic Northstar workspace. See [docs/DEMO.md](docs/DEMO.md) for the release walkthrough, reset and recovery scenarios.

## Verify the session

```bash
npm run lint
npm run typecheck
npm run test:domain
npm run build
npm run test:e2e
```

Regenerate the checked-in synthetic sources with `npm run fixtures:generate`; their canonical map is `fixtures/northstar/manifest.json`. Generation is deterministic. The domain suite inspects the real PDF and workbooks and verifies reference failures. The browser suite starts the production server, checks the shell, refresh and keyboard access.

## Production run

```bash
npm ci
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) and refresh the page to confirm the production route remains available.

## Environment

Copy `.env.example` to `.env.local`. The example lists names only and contains no credentials. `.env*`, except the example, is ignored by Git. S01 does not require runtime secrets.

## Delivery

GitHub Actions runs installation from the lockfile, linting, type checking, domain tests, the production build and the browser smoke suite. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) and the records in [docs/sessions](docs/sessions).
