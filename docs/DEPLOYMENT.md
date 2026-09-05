# Deployment record

## Intended mode

| Field | S01 value |
|---|---|
| GitHub owner / repository | Open — user destination not yet available |
| Visibility | Private, inferred from the deal-data product context; unconfirmed |
| Hosting target | Vercel connected to GitHub; inferred and unconfirmed |
| Required review policy | One approving review and passing `verify` job before merge; inferred and unconfirmed |
| Live deployment URL | Open |

The application is compatible with a standard Next.js deployment. GitHub publication and live deployment are separate gates. S01 remains locally verified until the repository destination, GitHub authentication and hosting account are available.

## Vercel settings

- Framework preset: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Output: Next.js default
- Required environment variables: none for S01

Preview deployments should run for pull requests. Production should follow accepted commits on `main` only.
