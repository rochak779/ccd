---
name: "CC’d"
description: "A framed evidence desk for human-controlled diligence decisions."
colors:
  paper: "#f3f0f8"
  surface: "#fcfaff"
  surface-raised: "#ffffff"
  ink: "#211a2a"
  text-secondary: "#554b61"
  text-muted: "#726879"
  border: "#dcd4e5"
  control-border: "#887c95"
  accent: "#5c367a"
  accent-soft: "#e9def4"
  lavender: "#daccee"
  action: "#f4ce58"
  success: "#246546"
  success-soft: "#e5f3ea"
  warning: "#855b09"
  warning-soft: "#fff1c8"
  danger: "#a63b4e"
  danger-soft: "#fbeaee"
  action-hover: "#e8ba38"
  header-border: "#4a4055"
  header-status-text: "#d9cfdf"
  header-status-dot: "#9dd9b6"
  context-copy: "#3f3349"
  secondary-hover: "#f8f3fc"
  proposal-surface: "#eee4f7"
  proposal-rule: "#cdbdde"
typography:
  display:
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif'
    fontSize: "clamp(52px, 7vw, 88px)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  metadata:
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  wordmark:
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif'
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.02em"
  lead:
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "clamp(18px, 2vw, 21px)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  micro:
    fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif'
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  footer-mark:
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif'
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "normal"
  display-narrow:
    fontFamily: '"Barlow Condensed", "Arial Narrow", sans-serif'
    fontSize: "clamp(48px, 14vw, 64px)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.03em"
  locator:
    fontFamily: '"SFMono-Regular", Consolas, monospace'
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  badge: "6px"
  control: "8px"
  icon: "12px"
  frame: "24px"
  full: "999px"
spacing:
  xxs: "8px"
  xs: "12px"
  sm: "16px"
  md: "24px"
  lg: "32px"
  xl: "48px"
  2xl: "64px"
  3xl: "72px"
components:
  header-nav:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    height: "76px"
    padding: "0 32px"
  context-band:
    backgroundColor: "{colors.lavender}"
    textColor: "{colors.ink}"
    rounded: "{rounded.frame}"
    padding: "clamp(38px, 5vw, 72px)"
  link-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "48px"
  chip-neutral:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    typography: "{typography.metadata}"
    rounded: "{rounded.badge}"
    padding: "4px 10px"
  row-supported:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.success}"
    typography: "{typography.metadata}"
    height: "48px"
  row-missing:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.warning}"
    typography: "{typography.metadata}"
    height: "48px"
  button-prepared-disabled:
    backgroundColor: "{colors.action}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "46px"
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  input-operational:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
    height: "46px"
  warning-panel:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    padding: "20px 24px"
  workspace-section:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "clamp(24px, 4vw, 48px)"
  queue-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "20px 0"
    height: "124px"
  coverage-selection:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.badge}"
    padding: "14px 8px"
---

# Design System: CC’d

## Overview

**Creative North Star: "The Framed Evidence Desk"**

The Framed Evidence Desk treats diligence review as one joined working record. A broad lavender context field introduces the deal, then locks directly into stacked operational sections held by a decisive dark frame. Within it, overview, request tracking, baseline evidence and channel setup remain calm, neutral and easy to inspect.

The system uses expressive condensed type for orientation and restrained sans-serif type for the record itself. Yellow marks the reviewer’s prepared action, lavender provides context and selection, and semantic washes identify supported or missing evidence without implying that a proposal has already become an approved decision.

**Key Characteristics:**

- One continuous evidence frame, with strong outside edges and fine internal rules.
- Cool violet paper, broad lavender context and sparse yellow action.
- Compressed display hierarchy paired with quiet operational copy.
- Explicit status words, human-control language and inspectable evidence counts.
- Desktop-first density that becomes a single reading sequence on mobile.
- Persistent deal context, theme controls and section navigation around the working record.
- Tables, fields and provenance rows that favour comparison over card-based presentation.
- Ranked findings hand into one joined request, proposal and source review record.

## Colors

The palette feels cool, assured and operational: near-black violet ink gives the screen its structure, pale violet surfaces keep the record readable, and restrained semantic washes make evidence state legible.

### Primary

- **Structural Ink:** The header, outer frame, major seams and primary text use the darkest tone to make the whole screen read as one deliberate composition.
- **Human Action Yellow:** Reserved for the next deliberate reviewer action and text selection; it always carries dark ink.

### Secondary

- **Evidence Violet:** Used for focus, icons, human-control language and selected or contextual status.
- **Soft Evidence Violet:** Provides quiet emphasis behind neutral status and source-type marks.

### Tertiary

- **Context Lavender:** Fills the broad opening field and establishes deal or request context without asserting correctness.
- **Supported Green / Soft Supported Green:** Identify evidence that is actually supplied while leaving the parent request’s state explicit.
- **Missing Amber / Soft Missing Amber:** Identify absent evidence without borrowing the yellow action treatment.
- **Correction Red / Soft Correction Red:** Reserved for validation failures, destructive implications and explicit errors; never used for ordinary missing evidence.

### Neutral

- **Cool Violet Paper:** The page ground that carries the framed composition.
- **Quiet Work Surface:** The main reading surface for request and coverage panes.
- **Raised White:** Used for the secondary call-to-action and other controls that need to sit above lavender.
- **Supporting Plum:** Body copy beneath focal headings.
- **Muted Violet Grey:** Provenance and availability notes.
- **Fine Violet Rule:** Internal row and footer divisions.
- **Control Violet Rule:** Boundaries for interactive controls when a stronger line is needed.

### Named Rules

**The Context Is Not Correctness Rule.** Lavender establishes context or selection; it never certifies that evidence is sufficient.

**The One Human Action Rule.** Use yellow once per decision context, for the reviewer’s prepared next action.

**The Status Has Words Rule.** Semantic colour always travels with a precise label such as “Supported” or “Missing”.

**The Theme Preserves Meaning Rule.** Dark theme remaps surface, text, border and semantic tones while retaining the same role hierarchy; it does not invert action or status meaning.

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow and sans-serif fallbacks)  
**Body Font:** IBM Plex Sans (with Helvetica Neue, Arial and sans-serif fallbacks)  
**Label/Mono Font:** IBM Plex Sans for labels; the shipped workspace uses the system monospace stack for deal aliases and evidence locators.

**Character:** The pairing puts compressed confidence around a calm working record. Display type creates immediate orientation; the sans-serif carries every request, evidence statement, status and action without theatrical emphasis.

### Hierarchy

- **Display** (700, responsive 52–88px, 0.94 line-height): Reserved for the page thesis and the CC’d wordmark; keep the copy short enough to retain the compressed rhythm.
- **Headline** (600, 24px, 1.2 line-height): Pane headings and the proposed-state heading.
- **Body** (400, 16px, 1.5 line-height): Request text, evidence explanation and delivery copy, with a practical measure of about 64 characters in the opening field.
- **Label** (600, 14px, 1.3 line-height): Calls to action, build state and compact evidence rows.
- **Metadata** (600, 12–13px, about 1.4 line-height): Status chips and prepared-preview notes.
- **Locator** (400, 13px, 1.45 line-height): Deal aliases, spreadsheet ranges, hashes and other values that must be copied or inspected exactly.

### Named Rules

**The Condensed Frame, Neutral Record Rule.** Use Barlow Condensed for identity and major orientation; keep evidence, statuses and controls in IBM Plex Sans.

## Layout

The workspace uses one centred container capped at 1280px with 32px wide-screen gutters. A 76px dark header carries account context, theme choice and a 48px scrollable section-navigation row. A 220px lavender deal band joins directly to one vertically stacked workspace frame. Overview, tracker, baseline and setup sections use responsive 24–48px padding and are separated by 3px structural seams.

Wide data tables remain scrollable inside their own bordered region and use a sticky dark header; the page itself must never overflow horizontally. The finding review uses three joined columns at 1200px and above: request thread, proposed status with selectable coverage, then source context. From 768–1199px, the request thread spans the full width above a proposal/source pair. Below 768px, the container uses compact gutters, the review becomes one request → proposal → source sequence, status comparisons stack vertically, coverage rows become single-column records, and queue actions become full width. Header context also stacks, navigation remains horizontally scrollable, control grids become one column, attachment metadata stacks, and claim fieldsets collapse from three columns to one. The broader workspace reading sequence remains overview → requests → baseline → deal setup.

Spacing follows an 8px-rooted rhythm, with 12px and 20px optical steps where compact text or icon relationships require them. Large gaps separate regions; individual evidence rows stay compact and are divided by rules instead of nested cards.

## Elevation & Depth

The working composition is flat. Depth comes from tonal layering, the dark outer frame and its exposed seams, with no shadow under the context band, panes, action or rows. The sole shipped shadow is a restrained halo around the small green build-status dot.

### Shadow Vocabulary

- **Status halo** (`0 0 0 4px rgb(157 217 182 / 14%)`): Used only to make the tiny assembled-state indicator legible against the header.

### Named Rules

**The Flat Working Record Rule.** Static evidence surfaces never lift; use frame, fill and fine rules to establish depth.

## Shapes

The system moves from broad, expressive framing to compact operational detail. The joined composition uses gently rounded top corners (24px) and square internal seams. Controls use measured 8px corners, chips and evidence markers use 6px corners, and icon boxes use 12px corners. Only the tiny status dot is fully round.

Outer composition lines are 3px and internal divisions are 1px. Operational controls use 8px corners, theme controls and choice surfaces may use 12px corners, and data tables, definition lists, attachment rows and checklists remain square within the frame. A dashed ink boundary distinguishes an unavailable prepared action from an enabled decision without draining its yellow emphasis.

**The Frame Outside, Fine Rules Within Rule.** Spend heavy line weight on the composition boundary and seams; keep evidence rows quiet and individually readable.

## Components

### Buttons

- **Shape:** Compact, gently rounded rectangles with a minimum 46–48px height and 18px horizontal padding in S01.
- **Primary:** Human-action yellow with dark ink and bold sentence-case text. The shipped prepared action uses a dashed dark border because it is visibly unavailable.
- **Hover / Focus:** Interactive controls use short 160ms changes and a 3px violet focus outline offset by 3px. The secondary prepared-example link lifts 2px on hover.
- **Secondary:** Raised white with a 1px ink border; used to move from the claim into the prepared example.
- **Operational primary:** Yellow with a solid ink border for consequential reviewer or activation actions. Generic secondary actions use raised surface, evidence-violet text and the stronger control rule.

### Chips

- **Style:** Soft violet background, evidence-violet text, compact 4px × 10px padding and a 6px radius.
- **State:** Status words remain visible; the chip does not resemble a pressable pill.

### Cards / Containers

- **Corner Style:** The opening context field uses 24px top corners; working panes stay square where they meet.
- **Background:** Quiet work surfaces carry request and coverage; a slightly stronger lavender carries the proposed state.
- **Shadow Strategy:** Flat at rest; separation comes from the ink frame and tonal changes.
- **Border:** 3px outer frame and seams, 1px internal rules.
- **Internal Padding:** Responsive 28–42px on desktop and 24–30px on mobile.

### Inputs / Fields

- **Style:** Raised surface, 1px control-violet border, 8px corners, 46px minimum height and 10px × 12px padding. Labels sit above fields in 14px semibold body type.
- **Focus:** The global 3px evidence-violet outline remains visible with a 3px offset; the dark header uses pale violet for contrast.
- **Read-only / Exact values:** Deal aliases and locators use monospace and retain text selection. Disabled actions stay labelled and visibly unavailable rather than disappearing.
- **Error / Warning:** Errors use correction red with explicit copy. Limited coverage and inactive monitoring use an amber wash, amber border and a textual heading.

### Navigation

The 76px dark header is a compact brand anchor and workspace shell. The white condensed wordmark sits opposite deal/account context and a three-choice System / Light / Dark theme control. A second 48px row holds horizontally scrollable section links with a 3px violet active underline. Focus inside the header switches to a pale violet outline for contrast; mobile stacks the context without hiding the theme choice.

### Tracker Table

The tracker is a comparison surface, not a card collection. Search, status and sort controls precede one bordered, independently scrollable region capped at 520px. Its table keeps a 1050px minimum width, 13px record text, sticky ink header cells and 1px row rules. Linked request IDs are underlined evidence-violet text, and mobile provides explicit horizontal-scroll guidance.

### Attachment & Claim Review

Attachments are full-width ruled rows containing filename, category, lifecycle state, extraction note and removal action. Claim review uses bordered fieldsets with the claim label in the legend and a three-column Value / Unit / Period grid; source locator and original extraction remain immediately below before exclusion or confirmation. On mobile both patterns become a single sequence.

### Dialogs, Warnings & Checklists

Dialogs are compact raised sheets with a 3px structural frame and no shadow. Warning panels use an amber wash and exact consequence copy. Setup tasks use ruled checklist rows with a symbol, task label and requirement note; completion never relies on the symbol alone.

### Coverage Rows

Coverage has two densities. Summary coverage is a labelled list of 48px rows with a compact marker, evidence-component name and right-aligned status. Finding review expands each component into a selectable ruled row that keeps the requested item, email claim and attachment support distinct. Supported rows use green; missing rows use amber. The selected row uses a soft violet wash and inset violet outline, and updates only the related source context; selection never asserts support or approval.

### Proposed Decision Pane

The proposal region uses a stronger pale lavender to distinguish machine-prepared state from the approved record. Current approved and proposed statuses are shown together before coverage, with labels that keep the transition explicit. In read-only review, the region ends with an exact note that controls arrive later; do not infer or fabricate actions. When evaluation is pending or unavailable, replace the proposal details with a textual warning while preserving the approved status and source material.

### Ranked Review Queue

The overview queue is a ruled row, not a dashboard card. It orders severity and workstream metadata, the finding summary and exact source count, then one yellow review action. The action count must match the sources the review actually exposes. On narrow screens the row stacks in that order and the action fills the available width.

### Joined Finding Review

A dark toolbar and 4px structural seams bind request thread, proposal and source context into one review record. Suggested severity and confidence are always labelled as system suggestions. Source context shows the recorded filename, monospace locator, compact evidence excerpt and an explanation of what it supports. A missing component receives an explicit no-source explanation; a failed preview retains the filename and locator instead of collapsing the pane.

## Do's and Don'ts

### Do:

- **Do** keep request, coverage and proposed state inside one joined frame.
- **Do** reserve condensed type for the wordmark and major orientation.
- **Do** pair every semantic colour with exact status language.
- **Do** keep the human-control statement beside the proposed decision.
- **Do** preserve the request → coverage → proposal reading order when the layout reflows.
- **Do** keep tracker scrolling inside its labelled region and expose horizontal-scroll guidance on narrow screens.
- **Do** keep source, locator, original extraction and lifecycle state beside editable evidence.
- **Do** keep ranked queue metadata, finding summary and exact source count together before the review action.
- **Do** let coverage selection change only the corresponding source or gap explanation.
- **Do** retain the approved status, raw reply and recorded locator when evaluation or preview fails.
- **Do** preserve all semantic roles and visible focus in both light and dark themes.
- **Do** remove smooth scrolling, transforms and transitions when reduced motion is requested.

### Don't:

- **Don't** split the evidence sequence into a scattered dashboard of interchangeable cards.
- **Don't** use lavender, green or yellow as a substitute for approved-state language.
- **Don't** add shadows to static panes or make evidence rows lift on hover.
- **Don't** use condensed display type for source prose, filenames or evidence values.
- **Don't** turn every status or control into a pill.
- **Don't** hide unknown owners, missing dates, limited coverage or inactive monitoring; label them explicitly.
- **Don't** let dialogs, sticky table headers or navigation obscure evidence or keyboard focus.
- **Don't** present suggested severity, confidence or proposed status as a human-approved decision.
- **Don't** document or imply source-inspector tabs or decision controls until those interactions ship.
- **Don't** introduce gradients, decorative finance imagery or autonomous-AI theatre.
