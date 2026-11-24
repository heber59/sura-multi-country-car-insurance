# Multi-Country Car Insurance

Angular frontend and Strapi content management for car insurance in Chile and Colombia.

See [AGENTS.md](AGENTS.md) for contributor rules, frontend architecture, and the branch flow. See [Functional scope](SCOPE.md) and [Agent workflow](FLOW.md).

## Technical requirements

| Topic             | Requirement                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| Frontend          | Angular 21+, standalone components, signals, and built-in control flow (`@if`, `@for`). No NgModules. |
| Content backend   | Strapi 5+.                                                                                            |
| Forms             | Generate the first wizard step from Strapi configuration with typed validation.                       |
| Multi-country     | Document how content differs by country in an architecture decision record (ADR).                     |
| Security          | Keep write-capable Strapi tokens out of the browser. Minimize and justify public-role permissions.    |
| Testing           | Unit-test relevant logic and cover the full flow for at least one country with an end-to-end test.    |
| Environment       | Start the whole project with one command, such as `docker compose up`, and seed both countries.       |
| Accessibility     | Make the entire wizard keyboard-operable and give every field an accessible label.                    |
| Responsive design | Support mobile and desktop.                                                                           |

## Run the app locally

Run `npm start` from the repository root. The [frontend setup guide](frontend/README.md) covers starting Strapi and Angular, editing and publishing market copy, and running checks.

## Assessment evidence and gaps

- [Story-to-release evidence](docs/qa/US-01-03.md) links the application revision, tests, review fixes, and QA status. The owner authorized implementation and publishing. Formal approval of the three specs and deployed QA remain pending.
- The assessment requires original, unedited agent-session exports. Public-safe exports are unavailable. The [session index](docs/agent-sessions.md) identifies the original local records for delegation, human corrections, and review fixes.
- Strapi stores each plan's market and base price. Angular uses that market's currency and locale (CLP for Chile and COP for Colombia). This prevents contradictory market and currency values. The independent Strapi currency field requested by the assessment is omitted.
- The [production dependency audit](docs/strapi-dependency-audit.md) records the outstanding CMS advisories and compatibility constraints.
