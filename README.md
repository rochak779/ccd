# CC’d

CC’d turns ordinary diligence email into an evidence-linked tracker proposal while keeping material decisions with a human reviewer. This repository currently contains the S01 application and delivery foundation.

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

## Verify the session

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The browser suite starts the production server from the completed build, opens the root route, checks the shell, refreshes it and confirms keyboard access to the skip link.

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

GitHub Actions runs installation from the lockfile, linting, type checking, the production build and the browser smoke suite. The intended hosting mode is GitHub with Vercel; repository coordinates and account connection are still unconfirmed. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) and [docs/sessions/S01.md](docs/sessions/S01.md).
