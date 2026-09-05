# Deployment record

## Intended mode

| Field | S01 value |
|---|---|
| GitHub owner / repository | `rochak779/ccd` |
| Visibility | Private |
| Hosting target | Vercel project `ccd` |
| Required review policy | One approving review and passing `verify` job before merge for subsequent session PRs |
| Live deployment URL | `https://ccd-ten.vercel.app` |

The application is compatible with a standard Next.js deployment. GitHub publication and live deployment are separate gates. The S01 root commit established `main` directly because no earlier base commit existed; subsequent sessions use branch and pull-request review. Vercel’s GitHub App does not currently have access to the private repository, so production is deployed through the authenticated CLI and automatic pull-request previews remain unavailable until that access is granted.

## Vercel settings

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Output: Next.js default
- Required environment variables: none for S01

Preview deployments should run for pull requests. Production should follow accepted commits on `main` only.
