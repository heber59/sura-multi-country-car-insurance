# ADR 004 — Shared frontend style foundations

**Status** — Proposed

## Context

The Angular wizard shares a layout across Chile and Colombia. Components need consistent color, spacing, typography, and keyboard focus while keeping step-specific layout local.

## Decision

Register [styles.scss](../../frontend/src/styles.scss) as the global Angular style entry when scaffolding the frontend. It loads [tokens](../../frontend/src/styles/_tokens.scss) and [base styles](../../frontend/src/styles/_base.scss) once. Use semantic CSS custom properties in component SCSS, such as `var(--color-text)` and `var(--space-16)`. Use a 2px spacing grid from 2px through 32px. Token names reflect pixels at a 16px root size, while rem values scale with user font settings. Put shared values in tokens and component layout beside its template. Keep global selectors limited to element defaults and keyboard focus.

Use bone for the canvas, emerald for text and focus, and soft orange for primary actions with dark emerald labels. Reserve red for errors. Use Arial for body and form text. Use Moonston for large headings when available, with Georgia as the fallback. Both markets share these tokens. Add a scoped override only when a design requirement calls for a distinct theme. Keep that override alongside the shared tokens.

## Alternatives considered

- **Styles defined per component** — Quick for one screen, but values drift as the wizard grows.
- **Bootstrap** — Provides ready-made styling, but introduces a framework and override layer before the wizard needs one.

## Consequences

Changes to shared values propagate across the wizard. The Moonston font asset is pending. Components remain responsible for checking contrast in the contexts where they use the tokens, including interaction states.
