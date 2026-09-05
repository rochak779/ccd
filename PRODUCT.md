# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js, TypeScript, Tailwind CSS, customised accessible UI primitives and Lucide icons. This stack is specified by the implementation plan and brand guide. The application is desktop-first and responsive.

## Users

The primary user is a private-equity associate or senior associate working on an active transaction. They send diligence questions through ordinary email, receive PDFs and spreadsheets, and maintain an Excel-like request tracker across parallel workstreams. A vice president or deal lead is the secondary reviewer for material unresolved items.

## Product Purpose

CC’d turns an ordinary diligence email exchange into an accurate, evidence-linked tracker update without requiring the analyst to duplicate the work. Success means a response can be routed to the correct deal, checked against requested evidence, reviewed by a human and recorded with an inspectable source and decision history.

## Positioning

Communication systems know messages and trackers know rows. CC’d reconciles the two by deciding whether a response and its attachments actually satisfy a specific diligence request, while keeping the decision human-controlled.

## Operating Context

Users work in email, spreadsheets, PDFs, trackers and deal-team review meetings. The prototype uses a synthetic Acme Capital / Project Northstar workspace and prepared inputs. A response is an event; an answer is a verified state.

## Capabilities and Constraints

- The complete seeded journey precedes optional live Gmail integration.
- Deal routing is deterministic through a unique deal alias; AI must not guess the deal.
- Evidence uses inspectable file, page, sheet, range or cell locators.
- Material tracker changes require human approval and retain an audit history.
- The prototype uses synthetic information and test accounts only.
- External Excel synchronisation, whole-mailbox surveillance, autonomous email sending and silent material closure are out of scope.
- GitHub repository coordinates, visibility, review policy and the live hosting account are open decisions. GitHub with Vercel is the inferred target for S01 configuration because it preserves later Next.js server capabilities.

## Brand Commitments

The product name is CC’d. The supplied `brand.md` is the visual authority: cool violet paper, dark ink, lavender context, yellow human action, strong frames, Barlow Condensed display type, IBM Plex Sans body type and IBM Plex Mono for evidence locators. Both light and dark themes are required. The voice is exact, calm and operational, using English UK.

## Evidence on Hand

- `CC'd PRD.md`: complete product requirements and synthetic demo truth.
- `brand.md`: complete brand and interface system.
- `implementation.md`: ordered build and verification plan.
- `CC'd.webp`: supplied visual reference.

No customer testimonials, production usage metrics or validated commercial claims are available and none should be fabricated.

## Product Principles

- Separate a received response from a supported answer.
- Put evidence and gaps beside the decision they inform.
- Preserve human control over material tracker state.
- Make every consequential claim inspectable and every decision reconstructable.
- Degrade gracefully so source material and approved state remain available.

## Accessibility & Inclusion

Support keyboard navigation, visible focus, reduced motion, 200% zoom and mobile reflow. Meet WCAG AA contrast for text and essential controls. Status must never rely on colour alone.
