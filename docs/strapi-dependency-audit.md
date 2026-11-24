# Production dependency audit

On 23 November 2026, `npm audit --omit=dev --json` reported zero findings in Angular and 28 package entries in Strapi (22 high, six moderate, zero critical). A lockfile-only audit fix in an isolated copy changed zero packages and left all 28 findings. The CMS pins Strapi and its utilities to 5.63.0, the latest stable release returned by the npm registry in this check. Counts include dependent packages affected by the underlying advisories.

| Advisory family | Triage |
| --- | --- |
| [Zod](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) | High. Strapi pins Zod 3 across validation, core, admin, and utility packages. The audit's forced Strapi 4 downgrade conflicts with the assessment and the Strapi 5 Document Service. |
| [React Router](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), [second advisory](https://github.com/advisories/GHSA-337j-9hxr-rhxg) | Moderate. The audit suggests React Router 7. Strapi Admin targets React Router 6. |
| [glob](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4), [minimatch](https://github.com/advisories/GHSA-g3hv-75wg-m249) | Moderate, inherited through tooling including rimraf. Validate a compatible Strapi dependency update before deploying. |
| [Hono Node server adapter](https://github.com/advisories/GHSA-rmxm-3fg6-px4f) | Moderate, transitive. Review the Strapi tooling dependency chain for a compatible patch. |

The local assessment uses loopback Strapi and fictitious data. Angular calls published market reads. Editing is authenticated. These boundaries limit the assessment environment's exposure. Recheck the lockfile against a compatible Strapi 5 update and verify the admin build, publication tests, and two-market flow before a public CMS deployment.
