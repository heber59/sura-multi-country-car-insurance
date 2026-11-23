---
name: insurance-development
description: Implement an assigned Sura insurance story in Angular or Strapi and prepare evidence for independent review. Use for landing pages, wizard steps, and supporting project infrastructure.
---

# Insurance development

Read the assigned acceptance criteria, [workflow](../../FLOW.md), [frontend layout](../../docs/frontend-structure.md), and [insurance story skill](../insurance-story/SKILL.md). Use the accepted ADRs linked by the spec. Start from the approved revision or the portion of a working spec the owner authorized. Bring unresolved behavior to Story QA and continue with authorized criteria that are independent of it.

1. Map each assigned criterion to the route, data contract, state, or infrastructure it affects. Inspect nearby code and reuse existing market resolution, Strapi transport, shared UI, and scripts where available. Keep behavior specific to a wizard step in that feature.
2. Implement through the real entry point. Validate Strapi responses at the boundary and exercise the unavailable state for missing content. When content, navigation, or state is market-specific, verify both `/cl` and `/co` with distinguishable fictitious data. Review permissions and browser configuration when a change touches Strapi access.
3. Run the relevant checks defined by the repository. Use unit tests for changed validation, mapping, or state rules and browser checks for affected user journeys. Record commands and outcomes, including checks blocked by missing setup.
4. Hand the verifier the spec revision, assigned criteria, changed paths, test evidence, and open decisions. Follow [story records](../../docs/story-records.md) for evidence and [project rules](../../AGENTS.md#branch-flow) for publishing authorization.
