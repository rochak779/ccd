# Deployment record

## Intended mode

| Field | S01 value |
|---|---|
| GitHub owner / repository | `rochak779/ccd` |
| Visibility | Private |
| Hosting target | Vercel connected to GitHub; inferred and unconfirmed |
| Required review policy | One approving review and passing `verify` job before merge; inferred and unconfirmed |
| Live deployment URL | Open |

The application is compatible with a standard Next.js deployment. GitHub publication and live deployment are separate gates. The S01 root commit established `main` directly because no earlier base commit existed; subsequent sessions use branch and pull-request review. Live hosting remains open until the Vercel account connection is confirmed.

## Vercel settings

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Output: Next.js default
- Required environment variables: none for S01

Preview deployments should run for pull requests. Production should follow accepted commits on `main` only.
