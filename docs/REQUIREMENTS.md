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
| Atomic persistent state and tamper-evident audit | PRD §§14, 22, 31, 35 | S03 | `tests/domain/s03-persistence.test.ts` | Implemented locally |
| Responsive branded shell and persistent themes | Brand §§3–8, 12, 14, 15, 18 | S04 | cumulative browser test; desktop/mobile screenshots | Implemented locally |
| Deliberate landing and isolated sample paths | PRD §17.1.1 | S05 | `s03-s10-workflows.spec.ts` | Implemented locally |
| Refresh-persistent simulated onboarding | PRD §§17.1.2–17.1.6 | S06 | `s03-s10-workflows.spec.ts` | Implemented locally |
| Deterministic deal alias and explicit activation | PRD §§17.1.7, 17.1.11–17.2 | S07 | `s03-s10-workflows.spec.ts` | Implemented locally |
| Recoverable baseline intake and limited coverage | PRD §§17.1.8–17.1.9, 33 | S08 | cumulative browser test; component validation states | Implemented locally |
| Source-linked human baseline confirmation | PRD §17.1.10 | S09 | cumulative browser test; retained corrections | Implemented locally |
| Data-derived overview and 12-record tracker | PRD §§17.1.13, 17.14, 17.24, 21, 25 | S10 | cumulative browser test; tracker source fixture | Implemented locally |
| Exact-count ranked review entry and read-only finding composition | PRD §§17.9, 17.11; brand §§14.8–14.9, 15.2 | S16 | `tests/e2e/s16-review.spec.ts`; light/dark desktop/mobile captures | Implemented locally |
| Four-component coverage selection reveals only related evidence or an explicit gap | PRD §17.11; brand §14.8 | S16 | source-link and missing-row browser case | Implemented locally |
| Evaluation/source failures retain approved state and raw sources | PRD §17.11; brand §§9, 15.2 | S16 | negative/recovery browser case | Implemented locally |
| Deterministic intake, routing, replay protection and reply matching | PRD §§17.3–17.7, 34 | S11–S12 | `tests/domain/s11-s12-ingestion.test.ts` | Implemented locally |
| Addressable workbook, PDF, CSV and TXT parsing with validated cache fallback | PRD §§17.8, 32–35 | S13–S14 | parsing domain suites | Implemented locally |
| Four-component coverage and source-grounded potential-conflict evaluation | PRD §§17.9–17.10 | S15 | `tests/domain/s15-evaluation.test.ts` | Implemented locally |
| Full evidence inspector with exact source identity and recovery states | PRD §§17.11, 17.16 | S17 | `tests/e2e/s17-inspector.spec.ts` | Implemented locally |
| Atomic approve, edit, reject and stale/replay-safe proposal decisions | PRD §§14, 17.11, 21–22 | S18 | decision domain and browser suites | Implemented locally |
| Reasoned overrides, corrections, conflict decisions and local escalation | PRD §§17.18, 17.22 | S19 | decision domain and browser suites | Implemented locally |
| Navigable evidence chain, activity and computed audit verification | PRD §§17.16–17.17, 30–31 | S20 | lifecycle domain and browser suites | Implemented locally |
| Second response, four supported components and explicit completion | PRD §§17.13, 17.19, 21, 38 | S21 | `tests/domain/s18-s21-decisions.test.ts`; lifecycle browser suite | Implemented locally |
| Integrated failure recovery preserves approved state and source metadata | PRD §§33–35, 37, 40 | S22 | `tests/domain/s22-failure-isolation.test.ts`; release browser suite | Implemented locally |
| O9 local persona hides inaccessible deal metadata | PRD prototype access limitation | S22 | domain access projection and restricted-persona browser case | Implemented locally |
| Responsive review at 320/390/768/1280 widths with keyboard and theme support | Brand §§4.8, 6, 7, 10–12, 15, 18 | S23 | release browser suite; recorded screenshots | Implemented locally |
| Reproducible reset, five-minute demo and failure handoff | PRD §§9, 36–40 | S24 | `docs/DEMO.md`; cumulative local gate | Implemented locally |
| O10 real identity/access enforcement and shared collaboration | PRD pilot boundary | Pilot | Explicitly deferred; local storage is not a security boundary | Planned |

State vocabulary: `Planned`, `Implemented locally`, `Verified remotely`, `Blocked`.
