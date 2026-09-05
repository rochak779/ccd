# CC’d Brand Guide

> Keep the evidence in view. A reply is an event; an answer needs evidence.

---

## How to use this guide

This is the branding, UI and UX specification for CC’d. It follows the supplied MeetFair template, with every product example and design rule adapted to diligence reconciliation.

**Product source:** [CC’d PRD](<CC'd PRD.md>), dated 05 September 2026. The PRD owns product behaviour, permissions, priorities and claims. This guide owns visual and verbal expression. It does not add capabilities to the four-hour prototype.

**Visual reference:** [CC’d.webp](<CC'd.webp>). The reference depicts a fashion storefront, not CC’d. Borrow its condensed headline energy, lilac fields, dark structural edges and selective yellow emphasis. Do not reproduce its layout, lettering, characters, product imagery, ticker, shopping controls or brand.

**Source of truth rule:** use the roles and tokens in this file instead of framework defaults. If a required design value or product behaviour is absent, ask the owner before introducing it. Existing source content and evidence must never be rewritten to fit the visual system.

**Direction:** “Keep the evidence in view.” An expressive typographic frame surrounds a precise working record. The signature composition connects the original request, a proposed update and its source evidence. The product earns trust by making each connection inspectable.

**Decision rationale requirement:** every non-obvious choice carries a defence: “We chose [X] because [Y]. We rejected [Z] because [W].” New choices require the same discipline.

**Confirmed direction:** bold throughout, including the working app; desktop-first responsive web; light and dark themes required; English UK (`en-GB`). Confirmed by the owner on 05 September 2026. The visual rules below are authored design decisions implementing those preferences and the PRD.

### Source consistency rules

- **C-14 coverage:** use the four independently evaluated components in PRD §§17.7, 18.4 and 39: contracts, FY25 revenue, FY26 revenue and expiry dates. The first reply supports one of four; three remain missing. Earlier PRD examples count three top-level asks. Do not mix top-level asks with evidence-component counts.
- **22% versus 31%:** display FY25 and FY26. The nine-percentage-point increase warrants review against the “stable” narrative; differing periods alone do not establish a contradiction.
- **Prior source:** use the locator actually present in the fixture. The PRD references both an IC baseline memo and CIM page 31. Never invent a page in the memo or label one file as the other.
- **Approval:** approving a partial tracker update leaves the potential conflict open unless the analyst separately resolves it.
- **Phasing:** P0 is the seeded prototype. P1 patterns are documented for consistency but remain optional. Production access and invitation patterns are specifications, not claims of implemented security.

---

## Table of Contents

1. The Brief
2. Surface Declaration
3. Visual Idea
4. Typography
5. Color
6. Spacing & Shape
7. Motion
8. Iconography
9. Information Hierarchy
10. States
11. Data & Formatting
12. Accessibility
13. Microcopy
14. Components
15. Surface-Specific Patterns
16. Global Anti-Patterns
17. What This Brand is NOT
18. Appendix: Token Scaffolds

---

## 1. The Brief

### Target user

An associate or senior associate on a small-to-mid-market private-equity deal team. They send diligence questions through ordinary email, receive PDFs and spreadsheets, and maintain an Excel-like request tracker across parallel workstreams. They need to review a response without hunting through files or duplicating tracker entry.

The secondary user is the VP or deal lead reviewing material unresolved items before an internal meeting or investment committee. The economic buyer remains a hypothesis in the PRD; do not turn it into validated positioning.

### Primary job to be done

When management replies to a diligence request, help the analyst determine what the reply and attachments actually answer, inspect missing or conflicting evidence, and approve an accurate tracker update with a source and decision history.

### Top 3 things the user must see

1. **The decision required:** which deal and request need attention, the currently approved state, and the proposed change.
2. **The evidence and gaps:** requested versus supplied components, exact source locators, and any period-aware potential conflict.
3. **The next human action:** approve the proposed state, correct it, request follow-up or escalate. In the canonical partial-response review, “Approve as partial” is strongest.

### Constraints

- **Platform:** desktop-first responsive web. The three-column review is the primary working composition; §15 defines tablet and mobile reflow without losing evidence.
- **Build:** four-hour, code-first hackathon prototype; the full seeded journey precedes optional live Gmail integration. Use synthetic information and test accounts.
- **Stack:** the PRD recommends Next.js, TypeScript, Tailwind, customised shadcn/ui and Lucide. React Flow is optional if evidence-chain cards can deliver the required inspection. No framework version is invented here.
- **Product limits:** internal tracker; no external Excel synchronisation, whole-mailbox surveillance, autonomous email sending or silent material closure.
- **Performance targets authored here:** usable application shell within 2 seconds on the agreed test device/network; evidence viewers and graph load on demand. Verify the target in implementation, not by assertion in this document. The demo response-processing sequence lasts no more than 8 seconds, as required by PRD §39.
- **Font budget:** at most 180 KB of compressed WOFF2 fonts requested on first paint. This is a target to measure after subsetting, not a verified asset size.
- **Locale:** English UK (`en-GB`), British spelling, `05 Sep 2026`, 24-hour time and international thousands grouping. Preserve source currency, precision, reporting period and timezone independently of interface locale.
- **Accessibility:** WCAG 2.2 AA is the design target. Colour checks here cover specified token pairs; an implementation still needs keyboard, screen-reader, zoom and reflow verification.
- **Themes:** light and dark required, with System / Light / Dark selection. Both carry the same bold composition through explicitly paired tokens.

### Rejected directions

1. **Literal fashion-storefront clone:** rejected because characters, merchandising tiles and a sale ticker would compete with sensitive evidence. Keep the reference’s confidence and contrast as design ingredients.
2. **Generic blue enterprise dashboard:** rejected because it loses the distinctive reference and makes CC’d resemble a general workflow tool. The record remains familiar; the frame can be recognisable.
3. **Black-and-gold private-equity luxury:** rejected because prestige is not the job. It suggests wealth management rather than evidence reconciliation.
4. **Autonomous AI command centre:** rejected because agent avatars, thinking animations and glowing graphs imply authority the product explicitly reserves for humans.

---

## 2. Surface Declaration

- [x] **Landing:** explanation, before/after proof, signup and sample entry. Persuade.
- [x] **App:** onboarding, baseline review, deal overview, request tracker, finding review, evidence and activity. Operate.
- [x] **Conversational:** grounded explanation within a finding; editable follow-up draft in P1. No open-ended assistant chat.
- [x] **Transactional:** P1 alert and daily-brief previews; later invitation and access messages. Read, then act.
- [x] **Mobile:** responsive reading and review, supporting the primary desktop workflow.
- [ ] **CLI:** not a product surface.
- [ ] **Docs:** no separate public documentation site in the prototype.

Foundations apply across declared surfaces. Surface-specific layouts and scope boundaries appear in §15.

---

## 3. Visual Idea

One sentence: **A clear frame around the evidence, with the decision left to you.**

The reference puts a strong dark framework around lilac fields, uses compressed display type to create immediate hierarchy, and saves yellow for emphasis. CC’d carries that confidence through both the landing page and working app. Large condensed workspace headings, substantial lavender context bands and strong structural edges make every major screen recognisably CC’d. A yellow action marks the reviewer’s next deliberate step. Inside those bold regions, white or plum surfaces carry readable rows, source excerpts and aligned figures.

**Bold throughout rule:** the application must retain the landing page’s visual conviction. Every major workspace has a condensed page title, a visible lavender context region and a strong outer frame. The three-column review reads as one designed composition with distinct compartments. Keep source text uncondensed and internal table rules fine so the stronger frame improves orientation. Do not reduce the app to a generic neutral table with a purple button.

We chose a bold working app because the owner explicitly wants the reference’s visual energy across the product. We rejected a marketing-only identity because it would disappear at the moment CC’d does its most distinctive work.

The signature is the **request → proposal → evidence** composition. Selecting a requested component reveals its corresponding source, while the approved tracker state remains distinguishable from the proposed state. An empty source position says “Missing”; an unreadable file remains visible. The system never fills a gap with visual reassurance.

**Reference translation:**

| Reference observation | CC’d interpretation | Boundary |
|---|---|---|
| Oversized condensed headline | A short, tightly set marketing statement | Never compressed evidence text |
| Lilac panels | Broad workspace context bands and selected evidence | No colour coding by document truth |
| Heavy black grid | Strong outer composition and clear review regions | Fine internal table rules |
| Yellow navigation/ticker accents | One prominent next action | No moving ticker or sale-like urgency |
| Rounded, asymmetric crop shapes | Broad landing frame with measured corners | No arbitrary clipping of source material |
| Character-led fashion imagery | Product-led request and workbook demonstration | No mascots or stock finance photography |

**Defence:** we chose a framed evidence composition because the product connects communication to a defensible record. We rejected decorative document collages because they show files without proving whether a request was answered.

### Wordmark and small mark

- The wordmark is **CC’d**, preserving capitals, lowercase `d` and the right apostrophe `’` (U+2019). Accessible name: “CC’d”. ASCII `CC'd` is acceptable in filenames and technical identifiers only.
- Set the wordmark in Barlow Condensed 700, with normal glyph proportions and `-0.01em` tracking. Do not recreate the reference’s “Retina” lettering.
- Use ink on light surfaces, light text on the dark frame, or ink on lavender. Never colour the apostrophe yellow; yellow denotes an action.
- Clear space: half the rendered wordmark height on every side. Minimum height: 24px on screen.
- A favicon may use `CC` in IBM Plex Sans 600 within a square lavender field; use the full wordmark wherever space permits. No envelope, robot, shield or certification seal is the logo.

**Defence:** we chose a typographic mark because the smallest user behaviour is already in the name. We rejected an envelope symbol because the product evaluates evidence beyond mail delivery.

---

## 4. Typography

### 4.1 Font selection

**Display: Barlow Condensed, 700.** Wordmark, marketing headlines and major app page titles. Its compressed proportions borrow the reference’s energy while providing an independent letterform system. Proposed statuses and source text remain in the reading family.

We chose Barlow Condensed because short headlines can be forceful without oversized horizontal sprawl. We rejected using condensed type throughout because filenames, financial periods and review prose need more room.

**UI and reading: IBM Plex Sans, 400 / 500 / 600.** App subheadings, proposed statuses, labels, controls, emails, explanations, tables and metadata. Keep its width axis at 100; do not compress UI text.

We chose IBM Plex Sans because the app must move cleanly between prose, labels and structured records. We rejected importing the template’s editorial serif because CC’d’s authority should come from source evidence rather than a literary voice.

**Locators and technical references: IBM Plex Mono, 400 / 500.** Request IDs, cell/range locators, deal aliases, hashes and selected source-value comparisons. Use Sans tabular numerals for ordinary financial tables.

We chose a matching mono because exact identifiers should remain easy to copy and distinguish. We rejected a monospace application because it would make routine review feel like debugging.

All three are listed under the SIL Open Font License in official Google Fonts metadata: [Barlow Condensed](https://github.com/google/fonts/blob/main/ofl/barlowcondensed/METADATA.pb), [IBM Plex Sans](https://github.com/google/fonts/blob/main/ofl/ibmplexsans/METADATA.pb), [IBM Plex Mono](https://github.com/google/fonts/blob/main/ofl/ibmplexmono/METADATA.pb). Retain licence files when distributing font assets. Verified 05 September 2026.

### 4.2 Type scale

Sizes are canonical endpoint values. Hero and marketing section titles may interpolate between the two endpoints; app roles use the stated fixed size unless explicitly responsive below.

| Role | Font | Weight | Wide / narrow px | Line height | Tracking |
|---|---|---:|---:|---:|---:|
| Wordmark | Barlow Condensed | 700 | 32 / 28 | 1 | -0.01em |
| Marketing hero | Barlow Condensed | 700 | 88 / 48 | 1 | -0.015em |
| Marketing section title | Barlow Condensed | 700 | 56 / 36 | 1.05 | -0.01em |
| App H1 | Barlow Condensed | 700 | 48 / 36 | 1.05 | -0.01em |
| H2 / proposed status | IBM Plex Sans | 600 | 24 | 1.25 | -0.01em |
| H3 / panel heading | IBM Plex Sans | 600 | 18 | 1.35 | 0 |
| Lead | IBM Plex Sans | 400 | 20 / 18 | 1.5 | 0 |
| Body / source excerpt | IBM Plex Sans | 400 | 16 | 1.5 | 0 |
| Table / compact body | IBM Plex Sans | 400 | 14 | 1.45 | 0 |
| Label / button / tab | IBM Plex Sans | 500 | 14 | 1.3 | 0 |
| Metadata / badge | IBM Plex Sans | 500 | 13 | 1.4 | 0 |
| Micro / provenance detail | IBM Plex Sans | 400 | 12 | 1.5 | 0 |
| Source locator / request ID | IBM Plex Mono | 400 | 13 | 1.5 | 0 |
| Copyable deal address | IBM Plex Mono | 400 | 14 | 1.5 | 0 |
| Compared evidence value | IBM Plex Mono | 500 | 28 / 24 | 1.2 | -0.01em |

One role per text element. No blanket semibold tables. On narrow touch layouts, editable text fields use 16px body to preserve legibility and avoid browser input zoom.

### 4.3 Weight and line height

- Barlow ships at 700 only, including app H1. It does not enter the app’s table or proposal heading.
- Sans 400 is reading; 500 is UI emphasis; 600 is headings and important inline distinctions.
- Mono 400 is identifiers; 500 is a compared value.
- Source prose uses 1.5 line height and a maximum reading measure of 68 characters. Emails preserve paragraph breaks.
- No synthetic weights or italics. `font-synthesis: none` is required.

### 4.4 Italic rules

No authored UI italics. Evidence quotations use quotation marks, an excerpt block and provenance. Preserve emphasis inside an original document viewer; do not restyle the document to match the app. This avoids an extra font download for decorative emphasis.

### 4.5 Numbers and monospace

Financial and status tables use Sans with `font-variant-numeric: lining-nums tabular-nums`. Right-align comparable values and retain meaningful precision. Mono marks exact reference strings and the two-value evidence comparison, not every amount or timestamp.

### 4.6 Typographic details

- Authored prose uses smart quotes: `“…”`, `‘…’`. Original email, filename and quoted evidence text remain verbatim.
- Preserve PRD status labels, including “Partial — evidence missing” and “Received — unreadable”. The template’s blanket em-dash ban does not override CC’d’s status vocabulary. Elsewhere use ordinary sentences and colons.
- Use `…` for an in-progress label. Do not animate punctuation.
- Sentence case in UI. Uppercase is reserved for short section labels such as “PROPOSED STATUS”; do not uppercase filenames or full navigation labels.
- Never insert soft hyphens or visual substitutions into copyable aliases, hashes or cell references.

### 4.7 OpenType and variable axes

Enable tabular figures where comparison requires them. Keep IBM Plex Sans `wdth` at 100 and use only the specified weights. Do not enable stylistic sets, slants or optical-size axes that are not declared for the selected font. Barlow Condensed and Plex Mono can ship as the chosen static weights.

### 4.8 Font loading

Self-host WOFF2 assets with `font-display: swap`. Preload Barlow 700 and Sans on landing and main app routes because both are above the fold. Load Mono with evidence/reference surfaces. Do not preload every weight. Subset only to supported content needs; retain glyph coverage for real names and source excerpts, using system script fallbacks when necessary. Do not transliterate names.

Suggested asset names: `/fonts/barlow-condensed-700.woff2`, `/fonts/ibm-plex-sans-latin-var.woff2`, `/fonts/ibm-plex-mono-400.woff2`, `/fonts/ibm-plex-mono-500.woff2`. These are implementation paths, not files currently supplied.

### 4.9 Typography anti-patterns

- Condensed spreadsheet values, filenames or long all-caps explanations.
- Small grey source citations that cannot be comfortably inspected.
- Faux-bold, stretched logos, gradient text or coloured words chosen only for decoration.
- Rounding source figures to fit a large display treatment.
- Three families visible in every component simply because three are available.

---

## 5. Color

### 5.1 Neutral axis

**Cool, violet-tinted paper:** `#F3F0F8`. Ink is `#211A2A`.

We chose a faint violet neutral because it connects the work surface to the reference’s lilac without turning every data row purple. We rejected warm cream because it belongs to the supplied template, not this reference or product.

### 5.2 Surfaces and text

Dark values are explicitly designed, not automatic inversion. Both themes are required.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg` | `#F3F0F8` | `#18151D` | Page ground |
| `surface` | `#FCFAFF` | `#211C29` | Main working panels |
| `surface-raised` | `#FFFFFF` | `#2B2534` | Editable fields, dropdowns |
| `surface-overlay` | `#FFFFFF` | `#2B2534` | Dialog and sheet |
| `surface-tooltip` | `#211A2A` | `#F4EFF9` | Inverted tooltip |
| `text` | `#211A2A` | `#F4EFF9` | Headings, body, source content |
| `text-secondary` | `#554B61` | `#C4B8CF` | Supporting text |
| `text-muted` | `#726879` | `#AA9BB8` | Metadata, placeholder; still readable |
| `text-inverse` | `#FCFAFF` | `#211A2A` | Inverted neutral surfaces |
| `frame` | `#211A2A` | `#766985` | Major composition edges |
| `header-bg` | `#211A2A` | `#211A2A` | Dark brand header in either theme |
| `on-header` | `#FCFAFF` | `#FCFAFF` | Header text |

### 5.3 Borders

| Token | Light | Dark | Usage |
|---|---|---|---|
| `border` | `#DCD4E5` | `#494052` | Decorative dividers and static panels |
| `border-control` | `#887C95` | `#8C7A9C` | Input boundary, checkbox, unfilled button |
| `border-accent` | `#5C367A` | `#C9A6EA` | Selected interactive element |

Decorative dividers need not carry control contrast. Essential control boundaries always use `border-control`, not the faint decorative border.

### 5.4 Brand roles

| Role / token | Light | Dark | Meaning |
|---|---|---|---|
| `accent` | `#5C367A` | `#C9A6EA` | Navigation, links, selected evidence, focus |
| `accent-hover` | `#48255F` | `#DBBFF2` | Hovered accent interaction |
| `accent-dim` | `#E9DEF4` | `#3A294B` | Selected row or reference wash |
| `on-accent` | `#FCFAFF` | `#211A2A` | Label on solid accent |
| `lavender` | `#DACCEE` | `#3A294B` | Brand field, baseline-context field |
| `action` | `#F4CE58` | `#F4CE58` | One primary decision |
| `action-hover` | `#E8BA38` | `#E8BA38` | Primary hover |
| `on-action` | `#211A2A` | `#211A2A` | Primary label in both themes |
| `focus` | `#5C367A` | `#C9A6EA` | Focus ring on ordinary surfaces |
| `focus-on-header` | `#E9DEF4` | `#E9DEF4` | Focus on the fixed dark header |

**Lavender means context, not correctness. Yellow means an available action, not urgency or completion.** They may coexist: a selected evidence row can be lavender while “Approve as partial” is yellow. Neither should compete with the proposal heading.

We chose stable yellow with fixed dark text because a human decision is the same interaction in either theme. We rejected theme-dependent white text on yellow because it destroys contrast.

We chose lavender for selection because the reference already gives it a strong identity. We rejected using it to mark “AI verified” because evaluation remains a proposal.

### 5.5 Semantic status colours

| Semantic role | Light foreground / wash | Dark foreground / wash | Meaning |
|---|---|---|---|
| `success` / `success-dim` | `#246546` / `#E5F3EA` | `#9DD9B6` / `#20362A` | Human-confirmed completion, supported component, verified event chain |
| `warning` / `warning-dim` | `#855B09` / `#FFF1C8` | `#EAC266` / `#382E1B` | Missing, partial, unreadable or limited coverage |
| `danger` / `danger-dim` | `#A63B4E` / `#FBEAEE` | `#F2A0AF` / `#41232D` | Potential conflict, integrity failure, destructive control |
| `info` / `info-dim` | Accent / accent-dim | Accent / accent-dim | Processing, inferred match, proposed completion |

Status uses a small icon and exact words alongside colour. A supported component may be green without making its parent request complete. “Ready to complete” remains an informational proposal; it does not use the completed check badge.

Potential conflict uses a restrained rose foreground/wash, never a full red screen. Its label retains “Potential”. An error and a finding may share a hue but must have distinct text and recovery/action semantics.

**Defence:** we chose separate semantic washes because the application must distinguish selection, evaluation and decision. We rejected reusing yellow-filled action styling for warnings because it would make problems resemble buttons.

### 5.6 Data visualisation

The canonical proof is a coverage matrix plus two period-labelled values, not a chart. Show `1 of 4 supported`, each missing component by name, and `FY25 22% → FY26 31% · +9 pp` beside sources.

If a chart is justified, use `data-prior: #726879` and `data-current: #5C367A` in light mode; `#AA9BB8` and `#C9A6EA` in dark mode. Add direct labels and dashed/solid distinctions. Neither series means good or bad. Do not introduce an arbitrary categorical rainbow or a red/green investment-performance judgement.

The evidence graph uses neutral nodes, purple selection and labelled edges. Node type comes from an icon and type label, not unique hue. A selected finding’s neighbourhood is the default scope.

### 5.7 Gradients, shadows and colour density

No gradients are specified. Use solid lavender, paper, ink and yellow. The reference is already forceful through shape and contrast.

App shadows are limited to floating surfaces. Static cards and table rows are flat. Light overlay shadow: `0 12px 32px rgb(33 26 42 / 16%)`; dark overlay shadow: `0 12px 32px rgb(0 0 0 / 28%)`. Surface steps and borders remain visible when shadows cannot be seen.

There is no arbitrary cap that counts shades of text as competing colours. Instead: at most one yellow primary action per decision context; one purple selection language; semantic colour only on actual statuses. Large lavender context fields and the strong frame appear throughout the app, not just on landing. Source-reading regions retain their neutral surface for sustained inspection.

### 5.8 Dark mode behaviour

Expose System / Light / Dark, respect the system choice initially, and persist an explicit choice. Render the initial theme before first paint. Brand yellow and its label remain fixed. The same broad fields and strong frame remain present in dark mode through their dark tokens. Source documents retain their original appearance: a PDF page may stay white inside the dark inspector. Never invert document pixels or change spreadsheet source colours to match the shell.

### 5.9 Contrast targets and calculated pairs

Static contrast ratios calculated from the specified sRGB hex values:

| Pair | Light ratio | Dark ratio | Required |
|---|---:|---:|---:|
| Primary text on page | 14.95:1 | 15.95:1 | 4.5:1 |
| Secondary text on surface | 7.90:1 | 8.79:1 | 4.5:1 |
| Muted text on surface | 5.10:1 | 6.41:1 | 4.5:1 |
| Control border on surface | 3.78:1 | 4.26:1 | 3:1 |
| Accent on surface | 8.95:1 | 8.02:1 | 4.5:1 for text |
| Accent on selected wash | 7.16:1 | 6.33:1 | 4.5:1 |
| Dark label on yellow | 11.09:1 | 11.09:1 | 4.5:1 |
| Success on its wash | 6.06:1 | 8.03:1 | 4.5:1 |
| Warning on its wash | 5.34:1 | 7.88:1 | 4.5:1 |
| Danger on its wash | 5.39:1 | 6.93:1 | 4.5:1 |

These do not certify every possible overlay, opacity or interactive state. Recheck actual combinations; do not apply opacity to readable metadata. Use outlined yellow controls on light backgrounds so their boundary is distinguishable.

### 5.10 Colour anti-patterns

- Tailwind purple, zinc or amber substituted for these roles.
- White labels on yellow; body text in pale lavender.
- Green “Complete” when a reply or file has merely arrived.
- A rose conflict pill without “Potential” before human confirmation.
- Decorative gradients, heatmaps or chart colours with no operational meaning.
- Counting files received as evidence completeness.

---

## 6. Spacing & Shape

### 6.1 Spacing scale

Base unit 4px. Approved scale: **4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px**.

| Values | Use |
|---|---|
| 4 / 8 | Label group, badge content, icon gap |
| 12 / 16 | Table cell padding, related fields, compact panel padding |
| 20 / 24 | Button horizontal padding, working-panel padding |
| 32 / 40 | Form groups, review-region separation |
| 48 / 64 | App sections and landing sub-sections |
| 80 / 96 | Major landing transitions |

One-pixel rules and optical icon adjustments are not spacing tokens. Do not introduce 18px gaps because a mock looks convenient.

### 6.2 Controls and density

- Standard button/input/select: **44px** minimum height.
- Coarse-pointer/touch controls: **48px** minimum target in either dimension.
- Dense desktop row action: **32px** target, only with a fine pointer; row still at least **48px** high.
- Multiline request row: **64px** minimum, allowed to grow with text.
- Form fields align with their adjacent action; compact source locators may look small but retain the interaction target.
- Badges are non-interactive, minimum 24px height; do not give them button hover affordances.

We chose a compact but readable desktop row because reviewers compare many requests. We rejected shrinking all controls to spreadsheet-cell height because evidence review contains frequent navigation and decision actions.

### 6.3 Radius and line weight

| Element | Radius |
|---|---:|
| Source highlight / code locator | 4px |
| Status badge / tooltip | 6px |
| Input / button | 8px |
| Working panel / attachment card | 12px |
| Dialog / sheet | 16px |
| Large landing / workspace composition frame | 24px |
| Avatar | 9999px |

Borders: 1px internal dividers and controls; 2px selected evidence; 3px outer landing and workspace composition. Review-region seams may expose 4px of the frame colour, using `space-1`. Do not put a 3px border around every cell.

We chose an expressive outer frame and quieter internal rules because the reference’s structure can create identity without increasing table noise. We rejected pill-shaped everything because a working record needs clear edges and compact alignment.

### 6.4 Layout dimensions

Landing content maximum 1280px; form maximum 560px; readable prose maximum 68ch; full review maximum 1600px. Responsive review regions are specified in §15. Use 16px page gutters at narrow widths, 24px at intermediate widths and 32px on wide screens.

### 6.5 Anti-patterns

Identical padding everywhere; nested cards for individual coverage rows; oversized pill navigation; cropped filenames to preserve a decorative grid; fixed-height panels that clip error text; CSS visual reordering that disagrees with keyboard order.

---

## 7. Motion

### 7.1 Principles

Motion explains a change in state or location. It never implies that evidence is stronger, processing is further along, or an update is saved before the underlying event confirms it.

We chose short linked highlights because selecting a coverage item should reveal its evidence. We rejected flying envelopes and graph-building spectacles because they consume attention without helping a reviewer decide.

### 7.2 Duration and easing

| Duration | Use |
|---|---|
| 100ms | Hover and press colour |
| 160ms | Badge/state transition, tooltip |
| 240ms | Inspector reveal, tab panel, dropdown |
| 320ms | Dialog/sheet entrance; optional landing proof reveal |

Standard: `cubic-bezier(0.2, 0, 0, 1)`. Exit: `cubic-bezier(0.4, 0, 1, 1)`. No spring or bounce. Continuous rotation is allowed only for an indeterminate task indicator, paired with a task label.

### 7.3 Motion taxonomy

- **Entrance:** opacity plus at most 8px translation on a floating panel; content remains immediately available to assistive technology.
- **Exit:** 160ms; return focus to the invoking control.
- **Hover:** colour or border change. Tables and evidence cards do not lift.
- **Press:** colour change, no scale effect that disturbs reading alignment.
- **Evidence link:** selected cell and matching coverage row adopt the same selection outline; do not auto-pan a graph unexpectedly.
- **Landing:** one finite request-to-evidence reveal, if used; all content also visible without animation. No repeated scroll animation.
- **Save:** transition the proposal to a recorded decision only after persistence succeeds. No celebratory animation.

### 7.4 Reduced motion

Under `prefers-reduced-motion: reduce`, remove transforms, smooth scrolling, shimmer and spinner rotation. Use static progress symbols plus live task text. A processing status still updates when its event completes. No timer or animation callback may control whether information is rendered.

### 7.5 Anti-patterns

Fake percentage progress, typewriter evidence, pulsing red conflicts, hover scale, ambient moving backgrounds, confetti for partial approval, animations delaying a source locator.

---

## 8. Iconography

### 8.1 Library

Use **Lucide**, following the PRD. Named imports only. Wrap it in a shared icon component with sizes 16 / 20 / 24px and stroke 2px. No second icon set for featured moments.

We chose one outline set because navigation, file states and review controls should share a stable visual grammar. We rejected duotone illustration icons in working panels because source content already provides the necessary detail.

### 8.2 Semantic mapping

| Meaning | Lucide icon | Required label example |
|---|---|---|
| Request | ListChecks | C-14 · Customer concentration |
| Email source | Mail | Email |
| Workbook | FileSpreadsheet | Workbook |
| PDF/text source | FileText | PDF · page 31 |
| Missing/partial | CircleAlert | Missing |
| Unreadable file | FileWarning | Received — unreadable |
| Potential conflict | TriangleAlert | Potential conflict |
| Supported/confirmed | CircleCheck | Supported / Complete, as appropriate |
| Proposed completion | CircleHelp | Ready to complete |
| History | History | Activity |
| Copy | Copy | Copy deal address |
| Source navigation | ArrowUpRight | Open source |

Icons inherit current text colour. Meaningful semantic icons use their status foreground. Selected navigation uses a background and visible indicator, not an unrelated filled-icon library.

### 8.3 Use and restraint

Use icons for source type, status, navigation and ambiguous compact actions. Form labels and every heading do not need icons. Decorative icons are `aria-hidden`; icon-only controls receive a precise accessible name. Optical adjustment may be ±1px after checking beside actual type.

### 8.4 Emoji

No authored emoji in branding, status, AI explanations or empty states. Original emails and user-authored names retain their content. PRD confidence-tag emoji belong to the planning document, not the product UI.

### 8.5 Anti-patterns

Sparkles for AI, shields implying certification, emoji error softeners, an icon for every label, colour-only file states, unlabeled close/remove actions.

---

## 9. Information Hierarchy

### 9.1 Emphasis tiers

| Tier | Content | Treatment |
|---|---|---|
| 1 | Decision required / proposed status | H1 or H2; position and size; one focal heading |
| 2 | Coverage gaps, source excerpt and period comparison | Body or H3; alignment and direct labels |
| 3 | Deal context, owner, workstream, source metadata | Compact body or metadata; secondary colour |
| 4 | Processing detail, hashes, exact audit timestamps | Micro/locator; expandable when lengthy |

Sources are not pushed into Tier 4 simply because they are citations. The cell/page and excerpt needed to judge a claim are Tier 2.

### 9.2 Signalling rules

Combine two or three of size, weight, colour and position. One focal decision heading; one yellow primary action in that context. The action is a control, not a competing promotional headline.

Show **Current approved status** and **Proposed status** with explicit labels. A proposal’s visual prominence must not imply that it is already applied. Show `High · suggested` until severity is confirmed.

Deal overview begins with exceptions. Message counts and attachment totals are supporting activity, never evidence of diligence quality. Review ordering follows PRD §17.9: material conflicts, critical unreadable files, missing evidence, partial answers, ambiguous matches, then low-risk completion proposals.

### 9.3 Anti-patterns

Everything semibold; a giant “31%” without period or source; completion donuts above unresolved findings; equally strong approve and complete buttons; long explanation before requested-versus-received evidence; graph-first navigation.

---

## 10. States

Every applicable screen designs empty, loading, error and success states. Lifecycle conditions remain visible alongside those generic states.

### 10.1 Empty and setup states

| Condition | Message | Next action |
|---|---|---|
| No deals | “No deals are being tracked yet.” | Create first deal; secondary Explore sample deal |
| Deal created, no baseline | “Establish the baseline.” | Add baseline documents |
| Baseline intentionally skipped | “Limited baseline coverage.” Explain comparisons are limited | Add baseline documents |
| Baseline ready, email inactive | “Ongoing monitoring is not active.” | Activate deal email |
| Active, no review items | “Nothing currently needs review.” | Copy deal email |
| Filter returns no rows | “No requests match these filters.” | Clear filters |
| No selected evidence | “Select a requested item to inspect its evidence.” | Existing coverage list is the action |
| Unsupported required item | “No supporting evidence received.” | Request follow-up, where available |

Use a short message within the actual working region. No zero charts, empty graph canvas, fake sample metrics or sad illustrations. Sample mode is visibly labelled “Sample deal · synthetic data”.

### 10.2 Loading states

- Under 200ms: retain stable content; no flashed indicator.
- After 200ms: show the affected control’s busy state or region label.
- After 1 second: use layout-matched skeleton rows if no previous content exists. Existing approved records remain visible.
- Multi-step parsing shows actual stages: Received → Validating → Parsing → Evaluating → Proposal ready. A step advances on its event, never on an invented timer.
- Per-file states remain independent. Ready files can be reviewed while another processes. A successful parse does not imply evidence coverage.
- For C-14, show “Comparing 4 evidence components”. Keep the last approved tracker state with a separate “Response processing” indicator.
- Persistent processing exposes last update and a safe return path. Transport timeouts must use actual configured limits; this guide does not invent them.

### 10.3 Error states

Every error explains what failed, what remained intact and a recovery path.

| Failure | Copy and recovery |
|---|---|
| Password-protected attachment | “This file is password protected. It was received but could not be inspected. Add an unlocked copy.” |
| Unsupported attachment | “This file type cannot be inspected here. The file is retained. Add a supported PDF, XLSX, CSV or TXT source.” |
| Parse failure | “We couldn’t read this workbook. The original file is retained; this request remains open.” Retry / Open file |
| AI evaluation fails | “The source is available, but evaluation failed. The tracker is unchanged.” Retry review / Open source |
| Approval cannot be saved | “Your decision wasn’t saved. The tracker is unchanged.” Retry; preserve entered reason |
| Connector unavailable | “New email cannot be synchronised.” Retry; demo may offer the labelled seeded fallback |
| Source locator unavailable | “This source location is unavailable. The claim cannot be verified here.” Open original / Correct source |
| Integrity check fails | “Event-chain verification failed.” Show affected event and retain history; no verified badge |
| Access removed | “Your access to this deal has changed.” Return to authorised deals; remove protected content |

Validate forms on blur and submit. Put errors next to real labels and link them with `aria-describedby`; focus an error summary on failed multi-field submission. Preserve valid entries.

Do not disguise failed AI evaluation with a freshly invented summary. A validated cached demo result may be used only when it is tied to the same fixture and labelled as demo/cached processing.

### 10.4 Success states

- Copy: change the local label to “Copied” for 2 seconds and announce it politely. No global toast.
- File received: update that file’s stage; do not show completion of the request.
- Baseline confirmed: show confirmed state, reviewer and next setup action.
- Partial approved: “Tracker updated. C-14 remains open with 3 missing items. Your decision and supporting evidence were recorded.” Conflict stays visibly open.
- Closure confirmed: “C-14 marked complete by Priya.” Display the recorded timestamp and evidence, not confetti.
- Event-chain verification: show “Event chain verified · [actual count] events” only after successful verification.

### 10.5 Lifecycle and uncertain states

Archive: monitoring stopped, history retained. Notification mute: ingestion remains active. Quarantine: source is not accepted into tracker evidence. Superseded source: old version remains inspectable. Proposed correction: preview downstream effect before confirmation; retain the original extraction and decision history.

### 10.6 Anti-patterns

“Something went wrong”; unreadable files disappearing; completed green skeletons; “all clear” when monitoring is inactive; loss of typed correction rationale; treating a cached result as live analysis; hiding uncertainty behind a confidence number.

---

## 11. Data & Formatting

### 11.1 Locale boundary

The default interface locale is **English UK (`en-GB`)**. Use British spelling: organisation, authorised, synchronise and labelled. Interface numbers use comma grouping and a decimal point (`1,234,567.89`). Dates use `05 Sep 2026`; time uses the 24-hour clock (`09:42`). This never changes original source text, document labels, monetary units or reporting periods. Store raw values and source display values separately.

### 11.2 Numbers and currencies

- Preserve source precision in evidence. Do not turn `31.04%` into `31%` in an exact source cell.
- Format derived summaries using the confirmed interface locale, with exact values accessible alongside them.
- Never infer currency from locale. Show `GBP 14.2m` or `£14.2m · GBP` when currency could be ambiguous; preserve a quoted source’s literal format separately.
- Do not convert currencies or compare values across currencies without a declared conversion basis and source. No exchange-rate feature is added by this guide.
- Keep accounting negatives and source units intact. A value reported in thousands is not the same magnitude as the same digits reported in millions.
- Request coverage is an exact count: `1 of 4 supported · 3 missing`. The denominator counts required evidence components, not attachments or numbered email bullets.

### 11.3 Percentages and changes

For the canonical example: **FY25 22% → FY26 31% · +9 pp**. Expand `pp` to “percentage points” in accessible text. Do not label this `+9%`. The figures are across periods; the potential conflict concerns the “stable concentration” narrative. Any numeric delta is calculated in code.

Do not call a model confidence score “accuracy” or imply calibration that has not been established. If a numeric confidence is supplied, show “Model confidence: 86% · uncalibrated” in supporting detail. Do not invent high/medium/low thresholds; show “Inferred match · review required” when no validated threshold policy exists.

### 11.4 Dates, periods and timezones

Use an absolute date and visible timezone where sequence matters: audit, approval, receipt, source version and deadlines. Example: `05 Sep 2026, 09:42 UTC`; a London-local rendering of that instant is `05 Sep 2026, 10:42 BST`. Relative time is optional supporting context, never the sole audit timestamp. Persist UTC instants; display using `en-GB` and the user timezone with the original UTC time available. Locale does not imply a timezone. Never use `MM/DD/YYYY` or guess whether an unlabelled source date is day-first.

`FY25`, `FY26`, `LTM Jun-26` and reporting dates are source labels. Do not map them to calendar years without evidence. If a fiscal year end is absent, show “Fiscal year end not specified”. “9 days open” must have a deterministic start event.

### 11.5 Provenance formatting

- PDF: `CIM.pdf · page 31`, plus exact excerpt.
- Spreadsheet: `Customer_Revenue_FY26.xlsx · Customer Summary!C3`, with surrounding headers/rows available.
- CSV: filename, row and column/header.
- TXT: filename and line range.
- Email: sender, absolute timestamp, subject and quoted excerpt.
- Hash: abbreviated with an explicit copy-full action; copying retrieves the complete hash.
- Version: “Current” / “Candidate” / “Superseded”; a newer filename alone never establishes authority.

### 11.6 Nulls and long strings

Use explicit states: “Not provided”, “Not extracted”, “Unreadable”, “Not comparable”, “No owner assigned”. Never replace missing data with zero. Ellipsis truncation requires access to the full value; critical source locators should wrap rather than depend on hover. Copy always uses the unmodified original value.

### 11.7 Anti-patterns

Locale-driven currency conversion, mixing millions and units, percentage/percentage-point confusion, guessed fiscal periods, fake confidence, filenames as sufficient citations, relative-only audit time, a blank cell hiding unreadable evidence.

---

## 12. Accessibility

### 12.1 Contrast and focus

Meet the targets in §5.9 on actual surfaces. Focus is a 2px outline with 2px offset; dark header controls use the dedicated pale ring. Focus styling must remain visible around yellow controls and within selected rows. Never remove the outline without a visible replacement.

### 12.2 Keyboard and focus management

- Skip link to the main workspace.
- Tab order follows displayed request → proposal → evidence regions in the wide review; narrow layouts use a deliberate linear sequence, never CSS-only reordering.
- Tabs use arrow keys, Home/End and their appropriate ARIA relationships. Enter/Space activates controls.
- Enter in a search field searches; it never approves a tracker change. No global single-key approval shortcut.
- Escape closes dialogs and transient inspectors. Restore focus to the invoking source link or button.
- Dialogs trap focus and expose title/description. Significant overrides show the effect and require a reason, with a safe cancel path.
- Selecting an evidence link moves focus to the inspector heading on narrow screens; on wide screens announce the selected source without unexpectedly stealing focus.

### 12.3 Targets, zoom and reflow

Use the target sizes in §6.2. Support 200% text zoom and 320 CSS-pixel reflow. Let badges wrap and rows grow. Data tables/document canvases may scroll inside labelled regions; the page must not require horizontal scrolling to find approval controls. Sticky actions must not obscure focused content or validation messages.

### 12.4 Screen readers and semantics

- Requests use a semantic table with column headers and explicit row links, not a clickable `div` grid.
- Coverage uses a table or labelled list. Announce “FY25 revenue by customer: missing”; an empty circle alone is insufficient.
- Status updates use one bounded `aria-live="polite"` region. Do not announce the whole evidence viewer after every parsing event.
- Name source links specifically: “Open Customer Revenue FY26, Customer Summary, cell C3”.
- Quote and comparison blocks retain real text even when a source screenshot is present.
- Evidence graph has an equivalent ordered chain with the same source links. Graph navigation is never the only path.
- Render raw email content as safe readable content; original formatting must not break the document’s semantic structure.

### 12.5 Motion, forced colours and authentication

Apply §7.4. Keep borders/outlines and labels usable in forced-colours mode. Allow password managers and paste in authentication fields. Prototype sign-in must clearly identify simulation; a polished lock icon is not evidence of account security.

### 12.6 Anti-patterns

Colour-only completeness, placeholder-only labels, tiny source-link hit areas, auto-focused approve buttons, unannounced errors, hover-only metadata, inaccessible canvas evidence, keyboard traps or screen-reader announcements for every received byte.

---

## 13. Microcopy

### 13.1 Voice and tone

**Three adjectives:** precise, composed, direct.

**Not:** accusatory, deferential, theatrical.

The product speaks like a capable analyst who can show their working. It identifies a gap without accusing management, and identifies a suggestion without claiming it is a decision.

- Landing: confident and concrete. State the familiar habit and the result.
- App: short, exact and action-led.
- Evidence explanation: source-first, period-aware, restrained about uncertainty.
- Error: factual, recoverable, no blame.
- Transactional: deal, finding, consequence and one authorised destination.

We chose composed specificity because the user needs a defensible decision. We rejected “friendly AI copilot” banter because it occupies space that should carry evidence.

### 13.2 Button labels

Use verb-first sentence case: “Start tracking a deal”, “Confirm baseline”, “Copy deal address”, “Review 3 sources”, “Approve as partial”, “Edit proposed update”, “Confirm complete”, “Copy draft”.

“Mark complete” is never a euphemism for approving partial coverage. “Send” is not available for a follow-up draft the app cannot send. Do not label a locally recorded invitation “Email sent”.

### 13.3 Labels and helper text

Visible labels above fields: “Work email”, “Organisation name”, “Project name”, “Target company”, “Reason for override”. Mark optional fields with “(optional)”. Upload fields name the document category and accepted formats. Numeric upload limits must come from implementation configuration; this guide does not invent them.

### 13.4 Approved vocabulary

| Use | Avoid |
|---|---|
| Response received | Answer confirmed, on delivery |
| Partial — evidence missing | Done, processed |
| Potential conflict | Management is wrong |
| Ready to complete | Complete, before approval |
| High · suggested | Critical fact, based only on model assessment |
| Source-linked | Guaranteed accurate |
| Event chain verified | Immutable, compliance-certified |
| Deal email active | We monitor your inbox |
| Monitoring active · notifications muted | Monitoring paused, when only alerts are muted |

### 13.5 Confirmations

State the action and consequence, then use the exact action label.

- Override: “Mark C-14 complete with 3 items still missing? Explain why the available evidence is sufficient.” Action: “Confirm override”. Reason required.
- Dismissal: “Dismiss this potential conflict? Record why it does not require further review.” Action: “Dismiss conflict”. Reason required.
- Archive: explain monitoring stops and history remains. Action: “Archive deal”.
- Access removal: explain loss of deal access and preservation of historical decisions. Action: “Remove access”.

### 13.6 Signature lines

- Tagline: **“The diligence tracker you keep in the loop.”**
- Behavioural instruction: **“CC the deal. We will keep the tracker current.”** Pair with a human-approval explanation.
- Hero supporting copy: “CC’d checks replies and attachments, flags missing or conflicting evidence, and proposes a tracker update for your team to approve.”
- Product insight: **“A reply is not the same as an answer.”**
- Review: “1 of 4 requested evidence components supplied.”
- Potential conflict: “The latest figures appear inconsistent with management’s description of ‘stable’ concentration.”
- Recorded result: “C-14 remains open with 3 missing items.”

### 13.7 Sample rewrites

| Before | After |
|---|---|
| “AI has resolved customer diligence.” | “The response supplies FY26 revenue. Three requested components are still missing.” |
| “Contradiction detected: 22% vs 31%.” | “Largest-customer share rose from 22% in FY25 to 31% in FY26. Review this against the ‘stable concentration’ statement.” |
| “Success! Tracker optimised.” | “Partial status recorded. Three items remain open.” |
| “Your files are secure and compliant.” | “Three files received. Two are ready to review; one could not be read.” |

### 13.8 Anti-patterns

“AI-powered” as the entire pitch; “magic”, “autopilot”, “never miss a risk”; fabricated savings or customer counts; unsupported security certifications; emojis as reassurance; generic “Submit”; blaming a sender; calling suggested severity confirmed.

---

## 14. Components

Use typed React components over accessible shadcn/ui primitives where appropriate, styled entirely through §18. Product components consume the same roles. The framework does not define the brand.

### 14.1 Button

**Primary:** yellow fill, fixed dark label, 1px ink boundary. One per decision context. **Secondary:** raised neutral with control border. **Ghost:** text with visible hover and focus, for low-priority actions. **Destructive:** danger foreground/wash, explicit consequence, confirmation when required.

Every variant includes rest, hover, pressed, focus-visible, disabled and loading. Height 44px, 48px on touch; padding 20px horizontal; radius 8px; icon gap 8px. Loading retains label and width, announces the operation and prevents duplicate submission. Disabled controls include a visible reason when their unavailability affects progress.

### 14.2 Input and selection

Rest, hover, focus, filled, error, disabled and read-only. Raised background, control border, 8px radius, 12px horizontal padding. Read-only aliases remain selectable and copyable. Labels above; helper/error below. Textareas grow for correction rationale. Do not hide reasons in tooltips.

### 14.3 Panel and attachment card

Surface background, 1px decorative border, 12px radius, 24px padding or declared compact 16px. Static panels have no hover lift. Attachment cards show filename, source message, processing state, coverage, warning and exact source action. A parsed card is not a completed request.

States: received, processing, ready, unsupported, unreadable, password protected, oversized, duplicate and parse failed. Never collapse all failures to a generic red attachment icon.

### 14.4 Request tracker

Semantic table: request ID, request, owner/requested-from as distinct fields when both exist, coverage, approved status, proposal indicator and age/due date. Do not infer reviewer ownership from the email recipient.

48px minimum rows, 64px for multiline text. Sticky headers; explicit sorting; selected row gets lavender wash and a leading indicator. No zebra striping by default. Allow long titles to wrap. Preserve filters and scroll position after review. At narrow widths expose a concise list leading to full details, or a labelled horizontal table region; no microscopic table fit.

### 14.5 Dialog, sheet and popover

Dialog for archive, access removal, baseline-skip consequence and material override. Sheet for secondary inspectors on constrained widths. Popover for short status definitions. Long source evidence belongs in an inspector, not a tooltip.

Dialog max width 560px; sheet max width 640px. Corner radii per §6. Trap/restore focus for modal surfaces. Scrim `rgb(20 15 27 / 48%)`. Layer order: base 0, sticky 10, dropdown 20, popover 30, sheet 40, dialog 50, tooltip 60, notification 70.

### 14.6 Notification

Persistent operational failures use an inline workspace banner. Field errors stay at the field. Ordinary copies and approvals confirm locally. A transient cross-screen notification, if necessary, lasts 6 seconds and pauses on focus/hover; at most one visible, with a dismiss control. Do not use it as the sole record of a failure or decision.

### 14.7 Navigation

Brand header: wordmark, organisation/deal context, necessary account controls. Deal navigation uses the PRD labels **Overview, Requests, Evidence, Activity**. Active tab has a purple indicator plus `aria-current`; hover is quieter. Deal settings remain separate from the evidence hierarchy. Do not call Evidence “Knowledge Graph”.

### 14.8 Coverage matrix: signature component

Rows are required evidence components. Columns: requested item, email claim, attachment support, evaluation, source action. A compact variant combines the two support columns but retains the distinction on expansion.

For C-14:

| Requested component | Evaluation | Reason/source |
|---|---|---|
| Top ten customer contracts | Missing | Email promises later delivery; no contracts received |
| Revenue by customer FY25 | Missing | No FY25 evidence received |
| Revenue by customer FY26 | Supported | Workbook source range from parsed evidence |
| Current contract expiry dates | Missing | No expiry evidence received |

Header: **1 of 4 supported · 3 missing**. Selecting the supported row reveals the actual workbook location. Selecting a missing row shows the absence and available next action; it does not invent a preview.

We chose named component rows because a count is only useful when the reviewer can inspect its denominator. We rejected a 25% progress ring because it conceals which evidence is absent.

### 14.9 Proposed-update panel: signature component

Show current approved status, proposed status, concise reason, supported/missing components, linked findings and next action. “Approve as partial” is primary for the canonical case. “Edit proposed update” is secondary; override and dismissal remain deliberate actions with reasons.

States: evaluating, proposal ready, saving, save failed, recorded, stale proposal. If evidence or another reviewer changes the record while the panel is open, explain that the proposal is out of date and require review of the refreshed version. Never overwrite another recorded decision silently.

### 14.10 Source inspector: signature component

Tabs **Email, Workbook, Previous evidence, Audit** for the canonical finding. Show filename, version designation, exact locator, period/unit, source excerpt and “Open surrounding rows/page”. A selected spreadsheet cell is outlined and highlighted without altering its displayed value. Preserve headers, raw/displayed value distinction and formula provenance.

Email body and attachment are separate sources. Source hash and full transport details are expandable technical detail. Missing locator, parse warning, no permission and source unavailable each have explicit states.

### 14.11 Potential-conflict comparison

Display the management statement, previous value with period/source, new value with period/source and calculated delta. Name the reason for review. Show suggested severity separately from confirmed severity. Never place a red cross over one source as if the system chose the truth.

### 14.12 Baseline review and version comparison

Group investment case, key metrics, open requests and warnings. Ready documents are reviewable independently. Confirmed/current/candidate/excluded labels remain distinct. Correction controls can edit value, unit, period or locator while retaining the original extraction.

A new version compares current and candidate sources, displays material versus informational changes, and asks whether it becomes current. Timestamp or filename alone cannot establish supersession. “Make current” does not accept every extracted claim automatically.

### 14.13 Deal alias and setup checklist

Alias field is mono, selectable, wraps safely and copies the exact unmodified address. Explain “Add this address in CC on deal conversations”. Show activation separately from copying: “Copied” is not “Monitoring active”.

Checklist shows completed, recommended, required and optional steps. Counts derive from actual included steps; the PRD’s illustrative “1 of 4” must not sit above five counted rows. Optional invitations never block progression. Skipping baseline explicitly retains limited-coverage status.

### 14.14 Audit timeline and evidence chain

Timeline entries show event, actor/system role, timestamp, previous/new state, reason and source. Expand hashes and technical details. Verification badge derives from actual verification. Render readable history even when verification fails.

Evidence-chain fallback: baseline → request → reply → attachment/cell → finding → human decision. Every node opens the same underlying source as the graph. No graph editing UI.

### 14.15 Explanation and follow-up draft

Finding explanation is concise Sans prose with inline source links. No avatar, chat bubbles or animated thinking. A draft is clearly headed **Draft follow-up**, editable and copyable; it cannot send mail. Copying a draft does not resolve a request or prove delivery. P1 only unless the core P0 loop is complete.

### 14.16 Component anti-patterns

Nested cards for every row, green proposal badges, anonymous approval buttons, source previews with invented cells, collapse of body and attachment into one source, a graph that is required to reach evidence, copied/sent confusion, unreadable file badges without recovery.

---

## 15. Surface-Specific Patterns

The confirmed direction is bold on every surface. Condensed page titles, broad lavender context fields, strong frames and yellow primary actions form one identity across landing, onboarding and the working app. Evidence text and financial tables retain their dedicated reading typography.

### 15.1 Landing

The first viewport must explain CC’d in under ten seconds. Compose a condensed headline beside a real product demonstration: an ordinary email and workbook lead to **Partial · 3 items missing · 1 potential conflict**. The demonstration uses the synthetic Northstar fixture and is labelled accordingly.

Suggested reading sequence:

1. Wordmark, tagline, explanatory sentence, **Start tracking a deal**; secondary **Explore a sample deal**; quiet Sign in.
2. The visible response-versus-answer proof, with four requested components and a source-linked 22%/31% comparison.
3. Three operating steps: establish a baseline once → CC the deal in ordinary email → review and approve evidence-linked updates.
4. Human control: proposal versus approved state, with an inspectable recorded decision.
5. Precise scope answers: supported files, baseline gaps, internal tracker and prototype limitations.
6. Closing action and simple footer.

Use a broad framed composition, typographic asymmetry and solid fields. Do not copy the reference’s tile arrangement, ticker or character poses. No invented testimonials, customer logos, security badges or quantified savings. Do not request files or mailbox access before the product has been explained.

### 15.2 App and onboarding

Onboarding follows the PRD: account → organisation → invitations or skip → first-deal choice → baseline files → baseline review → email activation → deal overview. A deliberate empty dashboard and sample path remain valid. Prepared local forms identify that authentication and invitation delivery are simulated.

Overview hierarchy: setup/monitoring limitations, needs attention, current request state, recent baseline/activity. The primary return action is “Review [actual count] exceptions”. Avoid large decorative email-processing totals.

**App composition:** a dark brand header anchors the page. Place the 48px condensed workspace title in a lavender context band with deal stage and a concise baseline/monitoring strip. Below it, a 3px framed work region contains the review or tracker. In the three-column review, 4px frame-colour seams separate the request, proposal and evidence compartments. The proposal header can occupy a lavender field; the evidence excerpt occupies a neutral reading surface. The yellow review action has enough space to read as a deliberate decision. Onboarding uses the same lavender heading band and framed form, so the identity is present from the first interaction.

**Responsive review layouts:**

- **1280px and above:** three columns inside a maximum 1600px frame. At the 1280px breakpoint with 32px gutters and two 16px gaps, the 1184px usable region can allocate approximately 288px request/thread, 400px proposal, 496px inspector. Above this, the inspector receives most extra width. These sum to available width; no fixed grid should overflow.
- **768–1279px:** main proposal/coverage and an evidence region; thread is a labelled expandable section. At narrower positions within this band, source inspection becomes a sheet or full-width region. Do not force three unreadable columns.
- **Below 768px:** one reading sequence: deal/request context → approved/proposed distinction → coverage and evidence links → decision action. Open the source in a full-width view with a clear return to the exact row.

Source viewers may scroll internally. Major page content and action labels wrap. The approved tracker stays usable when the AI or graph is unavailable.

### 15.3 Conversational

Explanations appear inside the finding, under the evidence they describe. Sources are present before prose generation finishes. No general chat composer, conversation history or “Ask your deal” feature is introduced.

P1 follow-up draft includes subject, recipient context, requested missing items and a neutral clarification request. Labels are **Edit draft**, **Copy draft**, **Return to finding**. External sending remains in the existing email client.

### 15.4 Transactional

P1 alert preview: clear deal/request identifier, suggested severity, one-line issue, coverage and a source-linked review action. Heading **Email preview** when simulated. A daily brief links every issue to its finding; “ready to close” is distinct from “closed”.

For later delivered email, use robust single-column HTML, system-sans fallback, text-first content and a plain-text alternative. Brand recognition comes from the wordmark, ink rules and small lavender accent; no dependency on a custom web font or animation.

Private deal links require access verification. Never publish financial findings, source excerpts or deal names in public Open Graph images. A generic CC’d link preview is sufficient. Production invite copy must state organisation role and assigned deal access, without implying organisation membership grants every deal.

We chose restrained transactional design because the email’s job is to take an authorised reviewer to evidence. We rejected public share cards from the supplied template because deal evidence is not a social artifact.

### 15.5 Mobile and touch

Desktop is the primary working surface. These reflow safeguards preserve the bold identity and review functionality whenever a phone opens the web product. Condensed page titles reduce to 36px; lavender context bands and the frame remain, with smaller gutters rather than weaker branding.

- Minimum touch target 48px; no hover-only controls.
- Four short navigation labels remain visible or scroll within a labelled tab region; do not hide Evidence behind an unlabeled icon.
- Long email aliases wrap without changing copied text.
- Source inspector is full width, preserving the source/period label and a return action.
- Sticky review action includes the request ID and proposed status; it appears after the user reaches the decision context and never hides evidence or keyboard-focused content.
- Bottom padding includes `env(safe-area-inset-bottom)` and the full sticky-action height. Fields and errors scroll above the software keyboard.
- Text-based evidence remains available if the original workbook/PDF is awkward on a phone.

### 15.6 Access, corrections and archive

Permission-denied surfaces show a neutral message without disclosing protected deal metadata. Production roles follow the PRD; visual controls alone are not access enforcement. Correction flow previews downstream effects, records material reasons and preserves earlier decisions. Archived deal surfaces clearly distinguish retained history from stopped monitoring.

---

## 16. Global Anti-Patterns

- Framework-default themes substituted for defined tokens.
- Copying the supplied fashion image or retaining its unrelated commercial content.
- Treating “received”, “parsed”, “supported”, “ready to complete” and “complete” as synonyms.
- Silently applying a material proposal or closing a potential conflict with an unrelated partial approval.
- Conflicts asserted without reporting periods, source locators and human judgement.
- Bright promotional styling inside exact source excerpts.
- Generic chat assistant as the main interface; graph spectacle before the request tracker.
- Automatic external follow-up sending, or copy that implies it.
- Public link previews exposing private deal information.
- Synthetic records presented as customer data; cache or simulation presented as live processing.
- Security certification, immutability, savings or customer-proof claims unsupported by the PRD and implementation.
- New required setup steps, backend thresholds or financial assumptions invented to fill template blanks.

---

## 17. What This Brand is NOT

- An email summariser: its output is an evidence-linked tracker proposal and recorded human decision.
- A replacement mailbox or virtual data room: the team retains its communication habit.
- An autonomous investment analyst: material judgement and closure remain human.
- A luxury finance brand: credibility comes from inspectable sources.
- A retail identity transplanted into finance: the reference informs visual grammar, not subject matter.
- A task manager that rewards replies: coverage matters more than activity.
- A compliance certification or immutable archive: the prototype can demonstrate a tamper-evident event chain only.
- A consumer sharing product: authorised deal context remains private.

---

## 18. Appendix: Token Scaffolds

CSS custom properties are canonical. The TypeScript object references them; it does not duplicate hex values. Light and dark palettes are both required. Typography/layout constants below are implementation scaffolds, not installed assets or a claim that a UI has been built.

### 18.1 CSS custom properties

```css
:root {
  color-scheme: light;
  --bg: #F3F0F8;
  --surface: #FCFAFF;
  --surface-raised: #FFFFFF;
  --surface-overlay: #FFFFFF;
  --surface-tooltip: #211A2A;
  --text: #211A2A;
  --text-secondary: #554B61;
  --text-muted: #726879;
  --text-inverse: #FCFAFF;
  --frame: #211A2A;
  --header-bg: #211A2A;
  --on-header: #FCFAFF;
  --border: #DCD4E5;
  --border-control: #887C95;
  --border-accent: #5C367A;

  --accent: #5C367A;
  --accent-hover: #48255F;
  --accent-dim: #E9DEF4;
  --on-accent: #FCFAFF;
  --lavender: #DACCEE;
  --action: #F4CE58;
  --action-hover: #E8BA38;
  --on-action: #211A2A;
  --focus: #5C367A;
  --focus-on-header: #E9DEF4;
  --success: #246546;
  --success-dim: #E5F3EA;
  --warning: #855B09;
  --warning-dim: #FFF1C8;
  --danger: #A63B4E;
  --danger-dim: #FBEAEE;
  --info: var(--accent);
  --info-dim: var(--accent-dim);
  --data-prior: #726879;
  --data-current: #5C367A;
  --scrim: rgb(20 15 27 / 48%);
  --shadow-overlay: 0 12px 32px rgb(33 26 42 / 16%);

  --font-display: "Barlow Condensed", "Arial Narrow", sans-serif;
  --font-body: "IBM Plex Sans", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-display: 700;

  /* Fluid endpoints: 48–88px and 36–56px; app roles stay explicit. */
  --type-wordmark: 32px;
  --type-hero: clamp(48px, calc(32px + 4vw), 88px);
  --type-section: clamp(36px, calc(28px + 2vw), 56px);
  --type-h1: 48px;
  --type-h2: 24px;
  --type-h3: 18px;
  --type-lead: 20px;
  --type-body: 16px;
  --type-compact: 14px;
  --type-label: 14px;
  --type-metadata: 13px;
  --type-micro: 12px;
  --type-locator: 13px;
  --type-alias: 14px;
  --type-evidence-value: 28px;
  --leading-display: 1;
  --leading-section: 1.05;
  --leading-h1: 1.05;
  --leading-h2: 1.25;
  --leading-h3: 1.35;
  --leading-body: 1.5;
  --leading-compact: 1.45;
  --leading-label: 1.3;
  --leading-metadata: 1.4;
  --leading-evidence-value: 1.2;
  --tracking-tight: -0.015em;
  --tracking-heading: -0.01em;
  --tracking-normal: 0;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --radius-locator: 4px;
  --radius-badge: 6px;
  --radius-control: 8px;
  --radius-panel: 12px;
  --radius-overlay: 16px;
  --radius-frame: 24px;
  --radius-avatar: 9999px;
  --line-divider: 1px;
  --line-selection: 2px;
  --line-frame: 3px;

  --control-height: 44px;
  --control-compact: 32px;
  --target-touch: 48px;
  --row-height: 48px;
  --row-multiline: 64px;
  --badge-height: 24px;
  --icon-compact: 16px;
  --icon-default: 20px;
  --icon-feature: 24px;
  --icon-stroke: 2;
  --width-landing: 1280px;
  --width-review: 1600px;
  --width-form: 560px;
  --width-sheet: 640px;
  --width-prose: 68ch;
  --gutter: 32px;

  --duration-instant: 100ms;
  --duration-fast: 160ms;
  --duration-standard: 240ms;
  --duration-enter: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --motion-offset: 8px;
  --z-base: 0;
  --z-sticky: 10;
  --z-dropdown: 20;
  --z-popover: 30;
  --z-sheet: 40;
  --z-dialog: 50;
  --z-tooltip: 60;
  --z-notification: 70;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #18151D;
  --surface: #211C29;
  --surface-raised: #2B2534;
  --surface-overlay: #2B2534;
  --surface-tooltip: #F4EFF9;
  --text: #F4EFF9;
  --text-secondary: #C4B8CF;
  --text-muted: #AA9BB8;
  --text-inverse: #211A2A;
  --frame: #766985;
  --border: #494052;
  --border-control: #8C7A9C;
  --border-accent: #C9A6EA;
  --accent: #C9A6EA;
  --accent-hover: #DBBFF2;
  --accent-dim: #3A294B;
  --on-accent: #211A2A;
  --lavender: #3A294B;
  --focus: #C9A6EA;
  --success: #9DD9B6;
  --success-dim: #20362A;
  --warning: #EAC266;
  --warning-dim: #382E1B;
  --danger: #F2A0AF;
  --danger-dim: #41232D;
  --data-prior: #AA9BB8;
  --data-current: #C9A6EA;
  --shadow-overlay: 0 12px 32px rgb(0 0 0 / 28%);
  /* Header, yellow, on-action and scrim intentionally remain invariant. */
}

@media (max-width: 1279px) {
  :root { --gutter: 24px; }
}
@media (max-width: 767px) {
  :root {
    --gutter: 16px;
    --type-wordmark: 28px;
    --type-h1: 36px;
    --type-lead: 18px;
    --type-evidence-value: 24px;
  }
}
@media (pointer: coarse) {
  :root {
    --control-height: var(--target-touch);
    --control-compact: var(--target-touch);
  }
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: var(--type-body);
  line-height: var(--leading-body);
  font-synthesis: none;
}
:focus-visible {
  outline: var(--line-selection) solid var(--focus);
  outline-offset: 2px;
}
.brand-header { --focus: var(--focus-on-header); }
.numeric { font-variant-numeric: lining-nums tabular-nums; }
.copyable { overflow-wrap: anywhere; }
.button-primary {
  color: var(--on-action);
  background: var(--action);
  border: var(--line-divider) solid var(--on-action);
  min-height: var(--control-height);
  padding-inline: var(--space-5);
  border-radius: var(--radius-control);
}
.button-primary:hover:not(:disabled) { background: var(--action-hover); }

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-instant: 0ms;
    --duration-fast: 0ms;
    --duration-standard: 0ms;
    --duration-enter: 0ms;
    --motion-offset: 0px;
  }
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
```

### 18.2 TypeScript references derived from CSS

```ts
export const tokens = {
  color: {
    bg: 'var(--bg)', surface: 'var(--surface)',
    raised: 'var(--surface-raised)', overlay: 'var(--surface-overlay)',
    tooltip: 'var(--surface-tooltip)', text: 'var(--text)',
    secondary: 'var(--text-secondary)', muted: 'var(--text-muted)',
    inverse: 'var(--text-inverse)', frame: 'var(--frame)',
    header: 'var(--header-bg)', onHeader: 'var(--on-header)',
    border: 'var(--border)', controlBorder: 'var(--border-control)',
    accentBorder: 'var(--border-accent)', accent: 'var(--accent)',
    accentHover: 'var(--accent-hover)', accentDim: 'var(--accent-dim)',
    onAccent: 'var(--on-accent)', lavender: 'var(--lavender)',
    action: 'var(--action)', actionHover: 'var(--action-hover)',
    onAction: 'var(--on-action)', focus: 'var(--focus)',
    focusOnHeader: 'var(--focus-on-header)',
    success: 'var(--success)', successDim: 'var(--success-dim)',
    warning: 'var(--warning)', warningDim: 'var(--warning-dim)',
    danger: 'var(--danger)', dangerDim: 'var(--danger-dim)',
    info: 'var(--info)', infoDim: 'var(--info-dim)',
    dataPrior: 'var(--data-prior)', dataCurrent: 'var(--data-current)',
    scrim: 'var(--scrim)',
  },
  font: {
    display: 'var(--font-display)', body: 'var(--font-body)',
    mono: 'var(--font-mono)',
  },
  type: {
    wordmark: 'var(--type-wordmark)', hero: 'var(--type-hero)',
    section: 'var(--type-section)', h1: 'var(--type-h1)',
    h2: 'var(--type-h2)', h3: 'var(--type-h3)', lead: 'var(--type-lead)',
    body: 'var(--type-body)', compact: 'var(--type-compact)',
    label: 'var(--type-label)', metadata: 'var(--type-metadata)',
    micro: 'var(--type-micro)', locator: 'var(--type-locator)',
    alias: 'var(--type-alias)', evidenceValue: 'var(--type-evidence-value)',
  },
  space: {
    1: 'var(--space-1)', 2: 'var(--space-2)', 3: 'var(--space-3)',
    4: 'var(--space-4)', 5: 'var(--space-5)', 6: 'var(--space-6)',
    8: 'var(--space-8)', 10: 'var(--space-10)', 12: 'var(--space-12)',
    16: 'var(--space-16)', 20: 'var(--space-20)', 24: 'var(--space-24)',
  },
  radius: {
    locator: 'var(--radius-locator)', badge: 'var(--radius-badge)',
    control: 'var(--radius-control)', panel: 'var(--radius-panel)',
    overlay: 'var(--radius-overlay)', frame: 'var(--radius-frame)',
    avatar: 'var(--radius-avatar)',
  },
  duration: {
    instant: 'var(--duration-instant)', fast: 'var(--duration-fast)',
    standard: 'var(--duration-standard)', enter: 'var(--duration-enter)',
  },
  ease: { standard: 'var(--ease-standard)', exit: 'var(--ease-exit)' },
  layout: {
    control: 'var(--control-height)', compact: 'var(--control-compact)',
    touch: 'var(--target-touch)', row: 'var(--row-height)',
    multilineRow: 'var(--row-multiline)', badge: 'var(--badge-height)',
    landing: 'var(--width-landing)', review: 'var(--width-review)',
    form: 'var(--width-form)', sheet: 'var(--width-sheet)',
    prose: 'var(--width-prose)', gutter: 'var(--gutter)',
  },
  icon: {
    compact: 'var(--icon-compact)', default: 'var(--icon-default)',
    feature: 'var(--icon-feature)', stroke: 'var(--icon-stroke)',
  },
  shadow: { overlay: 'var(--shadow-overlay)' },
  z: {
    base: 'var(--z-base)', sticky: 'var(--z-sticky)',
    dropdown: 'var(--z-dropdown)', popover: 'var(--z-popover)',
    sheet: 'var(--z-sheet)', dialog: 'var(--z-dialog)',
    tooltip: 'var(--z-tooltip)', notification: 'var(--z-notification)',
  },
} as const;
```

### 18.3 Integration guardrails

- Map shadcn theme roles to these semantic tokens before styling components. Do not let its default primary, destructive, radius or muted-foreground values leak through.
- Type-role classes combine the font, size, weight, line height and tracking from §4.2. A bare size token is not a complete type style.
- CSS variables cannot be used as native media-query breakpoints. Keep the explicit 768px and 1280px layout boundaries in the stylesheet and align any JavaScript media queries with them.
- Theme-invariant tokens intentionally inherit into dark mode; this is not an incomplete mirror. Never use theme-dependent `text` for the yellow action label: use `on-action`.
- Treat semantic request status, processing stage, finding state and human decision as distinct data fields. A single coloured `status` string must not flatten them into one state.
- Owner preferences are locked: bold throughout, desktop-first responsive web, light and dark themes, English UK. Upload limits, connector selection and production role enforcement remain engineering/product decisions under the PRD.
