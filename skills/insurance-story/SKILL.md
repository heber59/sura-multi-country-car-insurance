---
name: insurance-story
description: Apply the Sura market, wizard, and evidence conventions when specifying, implementing, or reviewing an insurance user story.
---

# Insurance story

Read [scope](../../SCOPE.md), the [technical requirements](../../README.md#technical-requirements), and [ADR 001](../../docs/adr/001-country-content.md) before making story decisions.

- Treat the route market as the source of truth for Strapi requests and wizard state. Whenever behavior depends on market, check both markets and missing content.
- Treat Strapi form fields as configuration. Map supported field types and validation rules into typed frontend models before rendering. Include coverage for a configuration change without rebuilding the frontend.
- Use fictitious policyholder and vehicle data in fixtures and simulate payment through confirmation or a mock gateway.
- Carry acceptance criterion IDs into the [review record](../../docs/story-records.md), linking the code, tests, and observed outcomes for each criterion.
