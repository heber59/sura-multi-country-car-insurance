# US-00 — PR #6 promotion verification

[Spec](../specs/US-00.md) · [ADR 001](../adr/001-country-content.md) · [Prior review](US-00.md) · [PR #6](https://github.com/heber59/sura-multi-country-car-insurance/pull/6) · [Application CI](https://github.com/heber59/sura-multi-country-car-insurance/actions/runs/45302541688)

**Promotion verdict** — The November 23, 2026 check failed AC2. Head `743e00530cc15c68aad9222734efb81204ff56f8`, tested merge `15a0960af60ff4d054a59e989912edea38a750f0`. Follow-up fixes are local. Final spec approval and deployed QA are pending.

| Criterion | Observed on the local merge |
| --- | --- |
| AC1 | Both routes rendered distinct copy and correct document languages. Visits, switches and reloads preserved the market. |
| AC2 | Chromium verified publication, draft visibility, reload after publish, missing content, network failure and clearing prior market copy. Malformed timestamps failed. Strapi returned published fields for the requested market and rejected draft, invalid-market and POST requests. |
| AC3 | Both quote actions retained the market and showed the Spanish unavailable screen before data collection. |
| AC4 | Both markets passed visible keyboard focus and quote activation at 320px and 1440px. |
| AC5 | Both heroes matched the requested subjects. Spanish alt text and neutral wording were present. |
| AC6 | Fresh SQLite seeded a published entry per market. Restart preserved drafts, published edits and an unpublished entry. No mock API was included. |

## Findings on the promotion revision

- **AC2** — `publishedAt: "0"` renders the supplied headline and quote action. Expected the Spanish unavailable state. [Response mapper](https://github.com/heber59/sura-multi-country-car-insurance/blob/743e00530cc15c68aad9222734efb81204ff56f8/frontend/src/app/features/landing/logic/map-landing-content.ts#L19-L23)
- **Project startup** — Startup uses separate Angular and Strapi commands. The project requires one command. [Setup](../../frontend/README.md#run-locally) · [Requirement](../../README.md#technical-requirements)

## Local follow-up

- **AC2** — The [mapper](../../frontend/src/app/features/landing/logic/map-landing-content.ts) checks Strapi's canonical UTC timestamp. Angular passed 14 tests. Chromium verified that `"0"` and February 30 both show the unavailable state in each market.
- **Startup and AC6** — Clean root [`npm start`](../../package.json) seeded and served both markets with a custom Strapi address and stopped both services on interrupt. A second review fixed the [proxy's](../../frontend/proxy.conf.cjs) hardcoded target. Seven independent checks covered defaults, `.env`, shell precedence and IPv4/IPv6.
- Angular and Strapi builds passed on WSL Node 22.22.2. GPT-6 lead and independent verifier. PR #6 CI covers the original head. Session exports are pending.
