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
---

# Design System: CC’d

## Overview

**Creative North Star: "The Framed Evidence Desk"**

The Framed Evidence Desk treats diligence review as one joined working record. A broad lavender context field introduces the request, then locks directly into request, coverage and proposed-state compartments held by a decisive dark frame. The composition is bold enough to be recognisably CC’d while the evidence rows remain calm, neutral and easy to inspect.

The system uses expressive condensed type for orientation and restrained sans-serif type for the record itself. Yellow marks the reviewer’s prepared action, lavender provides context and selection, and semantic washes identify supported or missing evidence without implying that a proposal has already become an approved decision.

**Key Characteristics:**

- One continuous evidence frame, with strong outside edges and fine internal rules.
- Cool violet paper, broad lavender context and sparse yellow action.
- Compressed display hierarchy paired with quiet operational copy.
- Explicit status words, human-control language and inspectable evidence counts.
- Desktop-first density that becomes a single reading sequence on mobile.

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

## Typography

**Display Font:** Barlow Condensed (with Arial Narrow and sans-serif fallbacks)  
**Body Font:** IBM Plex Sans (with Helvetica Neue, Arial and sans-serif fallbacks)  
**Label/Mono Font:** IBM Plex Sans for shipped labels; the broader brand reserves IBM Plex Mono for evidence locators when those appear.

**Character:** The pairing puts compressed confidence around a calm working record. Display type creates immediate orientation; the sans-serif carries every request, evidence statement, status and action without theatrical emphasis.

### Hierarchy

- **Display** (700, responsive 52–88px, 0.94 line-height): Reserved for the page thesis and the CC’d wordmark; keep the copy short enough to retain the compressed rhythm.
- **Headline** (600, 24px, 1.2 line-height): Pane headings and the proposed-state heading.
- **Body** (400, 16px, 1.5 line-height): Request text, evidence explanation and delivery copy, with a practical measure of about 64 characters in the opening field.
- **Label** (600, 14px, 1.3 line-height): Calls to action, build state and compact evidence rows.
- **Metadata** (600, 12–13px, about 1.4 line-height): Status chips and prepared-preview notes.

### Named Rules

**The Condensed Frame, Neutral Record Rule.** Use Barlow Condensed for identity and major orientation; keep evidence, statuses and controls in IBM Plex Sans.

## Layout

The shipped screen uses one centred container capped at 1280px with 32px wide-screen gutters. A 76px dark header precedes a lavender context band at least 330px tall. That band joins a three-column evidence frame in a 0.9 / 1.1 / 1 ratio; 3px ink gaps become structural seams between request, coverage and decision panes. Pane padding scales from 28px to 42px, while compact evidence rows remain at least 48px high.

At 950px and below, request and coverage share two columns and the decision spans the full width. Below 768px, the container uses 16px gutters, the header contracts to 68px, and the full frame becomes one continuous request → coverage → proposal sequence. The opening band grows to at least 440px so the headline, supporting copy and prepared-example link remain comfortably separated.

Spacing follows an 8px-rooted rhythm, with 12px and 20px optical steps where compact text or icon relationships require them. Large gaps separate regions; individual evidence rows stay compact and are divided by rules instead of nested cards.

## Elevation & Depth

The working composition is flat. Depth comes from tonal layering, the dark outer frame and its exposed seams, with no shadow under the context band, panes, action or rows. The sole shipped shadow is a restrained halo around the small green build-status dot.

### Shadow Vocabulary

- **Status halo** (`0 0 0 4px rgb(157 217 182 / 14%)`): Used only to make the tiny assembled-state indicator legible against the header.

### Named Rules

**The Flat Working Record Rule.** Static evidence surfaces never lift; use frame, fill and fine rules to establish depth.

## Shapes

The system moves from broad, expressive framing to compact operational detail. The joined composition uses gently rounded top corners (24px) and square internal seams. Controls use measured 8px corners, chips and evidence markers use 6px corners, and icon boxes use 12px corners. Only the tiny status dot is fully round.

Outer composition lines are 3px and internal divisions are 1px. A dashed ink boundary distinguishes the unavailable prepared action from an enabled decision without draining its yellow emphasis.

**The Frame Outside, Fine Rules Within Rule.** Spend heavy line weight on the composition boundary and seams; keep evidence rows quiet and individually readable.

## Components

### Buttons

- **Shape:** Compact, gently rounded rectangles with a minimum 46–48px height and 18px horizontal padding in S01.
- **Primary:** Human-action yellow with dark ink and bold sentence-case text. The shipped prepared action uses a dashed dark border because it is visibly unavailable.
- **Hover / Focus:** Interactive controls use short 160ms changes and a 3px violet focus outline offset by 3px. The secondary prepared-example link lifts 2px on hover.
- **Secondary:** Raised white with a 1px ink border; used to move from the claim into the prepared example.

### Chips

- **Style:** Soft violet background, evidence-violet text, compact 4px × 10px padding and a 6px radius.
- **State:** Status words remain visible; the chip does not resemble a pressable pill.

### Cards / Containers

- **Corner Style:** The opening context field uses 24px top corners; working panes stay square where they meet.
- **Background:** Quiet work surfaces carry request and coverage; a slightly stronger lavender carries the proposed state.
- **Shadow Strategy:** Flat at rest; separation comes from the ink frame and tonal changes.
- **Border:** 3px outer frame and seams, 1px internal rules.
- **Internal Padding:** Responsive 28–42px on desktop and 24–30px on mobile.

### Navigation

The 76px dark header is a compact brand anchor rather than a menu. The white condensed wordmark sits opposite a text-labelled green build status. Focus inside the header switches to a pale violet outline for contrast; mobile preserves the same two-part arrangement in 68px.

### Coverage Rows

Coverage is a labelled list of 48px rows, each with a compact marker, evidence-component name and right-aligned status. Supported rows use green; missing rows use amber. Fine violet rules keep comparison easy without turning each item into its own card.

### Proposed Decision Pane

The right-hand pane uses a stronger pale lavender to close the evidence sequence. A concise proposed-state heading leads, human approval is separated by a fine rule, and the prepared action ends the pane. The unavailable state is explained immediately above the disabled yellow button.

## Do's and Don'ts

### Do:

- **Do** keep request, coverage and proposed state inside one joined frame.
- **Do** reserve condensed type for the wordmark and major orientation.
- **Do** pair every semantic colour with exact status language.
- **Do** keep the human-control statement beside the proposed decision.
- **Do** preserve the request → coverage → proposal reading order when the layout reflows.
- **Do** remove smooth scrolling, transforms and transitions when reduced motion is requested.

### Don't:

- **Don't** split the evidence sequence into a scattered dashboard of interchangeable cards.
- **Don't** use lavender, green or yellow as a substitute for approved-state language.
- **Don't** add shadows to static panes or make evidence rows lift on hover.
- **Don't** use condensed display type for source prose, filenames or evidence values.
- **Don't** turn every status or control into a pill.
- **Don't** introduce gradients, decorative finance imagery or autonomous-AI theatre.
