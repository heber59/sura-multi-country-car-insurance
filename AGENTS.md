# Project rules

Build one Angular frontend for Sura car insurance in Chile and Colombia. Strapi manages market-specific content. Write code, identifiers, comments, and technical documentation in English. Customer-facing copy follows the market's Spanish locale.

Before changing code, inspect the architecture, folder layout, and nearby implementations. Follow existing conventions and accepted [ADRs](docs/adr/), the source of truth for architecture decisions. Use descriptive names and focused functions. Comment only when the reason behind a decision needs explanation. Keep each documentation file under 400 words.

## Frontend

Use standalone Angular components and lazy-load feature routes. Keep feature components, models, and tests together.

```text
frontend/src/app/
  core/              App-wide configuration and services
  core/market/       Market resolution and locale settings
  core/strapi/       Content requests and response mapping
  features/          Pages and business flows by feature
  shared/            Reusable UI and utilities
```

The `/cl` and `/co` route prefixes select the market. Request published Strapi content by market, using `es-CL` and `es-CO` for display. Show an unavailable state when content is missing. Keep features independent and shared code free of feature dependencies.

## Branch flow

Branch from `develop`. Name work branches `<brief-change>/<owner-initials>/<story-id>`. Use `Ha` for Heber Alvarez and the compact story ID from the spec, such as `flowMD/Ha/US01`. Use `DOCS` for shared documentation without a story, such as `docs/Ha/DOCS`.

Wait for an explicit publish request before creating a publish branch, pushing, or opening a PR. Return the PR link after publishing.

- **Publish docs** — Create the docs branch from `develop`, include only documentation changes, push it, and open a PR into `develop`.
- **Publish to develop** — Create or use the named work branch, push it, and open a PR into `develop` after verification.
- **Publish to QA** — Open a promotion PR from `develop` into `qa`.

The protected branches are `develop`, `qa`, and `main`. The repository owner configures protection. Humans review and merge promotion PRs after CI passes.

Use the [agent workflow](FLOW.md) for user stories.
