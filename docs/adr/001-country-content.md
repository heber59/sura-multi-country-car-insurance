# ADR 001 — Country-specific content

**Status** — Accepted

## Context

One Angular build serves Chile and Colombia. Editors need to change wizard forms, plans, and terms and conditions in Strapi independently for each market.

## Decision

Use `/cl` and `/co` to resolve a typed market code. Store that code on Strapi form configurations, plan entries, and terms and conditions. Fetch published entries for the selected market and map them into typed frontend models. Render copy from the selected entries and format values for `es-CL` or `es-CO`.

## Alternatives considered

- **Separate builds** — Isolate markets but duplicate deployments and conflict with the shared-build requirement.
- **Locale-only content** — Supports localized copy, but equates language and formatting with the market that determines plan availability and form structure.

## Consequences

Editors can publish country changes without rebuilding Angular. Seed both markets and verify that neither can display the other’s plans or form configuration. Keep wizard state keyed by market. Missing configuration shows an unavailable state. Show only published terms for the selected market. If they are unavailable, keep payment disabled.
