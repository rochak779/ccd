# Requirement coverage

Use one row per independently verifiable requirement. Add the exact automated test or manual evidence when a session implements it.

| Requirement | Source | Session | Verification | State |
|---|---|---:|---|---|
| Runnable Next.js and TypeScript application | PRD §28; implementation S01 | S01 | `npm run build`; root route smoke test | Implemented locally |
| Development, lint, type-check and build scripts | implementation S01 | S01 | `package.json`; CI workflow | Implemented locally |
| First browser route smoke test | implementation S01 | S01 | `tests/e2e/root-route.spec.ts` | Implemented locally |
| Credentials excluded from Git | PRD §33; implementation S01 | S01 | `.gitignore`; tracked-file check | Implemented locally |
| Minimal CC’d shell | implementation S01; brand §3 | S01 | Desktop/mobile screenshots; keyboard check; independent finish review `ship` | Implemented locally |
| GitHub CI | implementation S01 | S01 | `.github/workflows/ci.yml`; GitHub Actions `verify` job | Verified remotely |
| Published, refreshable deployment | implementation S01 | S01 | `https://ccd-ten.vercel.app`; browser open and refresh check | Verified remotely |
| Typed domain contracts for S02 entities | PRD §§18, 29, 32; implementation S02 | S02 | `src/domain/contracts.ts`; `npm run typecheck` | Implemented locally |
| Inspectable IC memo, tracker and FY26 workbook | PRD §38; implementation S02 | S02 | `npm run test:domain`; `fixtures/northstar/manifest.json` | Implemented locally |
| Normalised request, first reply, complete-control reply and noise message | PRD §§18, 38; implementation S02 | S02 | `fixtures/northstar/demo.json`; domain fixture test | Implemented locally |
| Invalid fixture references fail validation | PRD §32; implementation S02 | S02 | negative cases in `tests/domain/fixtures.test.ts` | Implemented locally |

State vocabulary: `Planned`, `Implemented locally`, `Verified remotely`, `Blocked`.
