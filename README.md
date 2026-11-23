# Sura Multi-Country Car Insurance

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

## Run the landing page locally

See the [frontend setup guide](frontend/README.md) for sample content, Strapi, and verification commands.
