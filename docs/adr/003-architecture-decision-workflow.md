# ADR 003 — Architecture decisions before implementation

**Status** — Proposed

## Context

The assessment requires at least a multi-country ADR and evaluates whether specs expose gaps, ADRs consider real alternatives, and human corrections and review fixes are traceable. Pages 4–5 also require deliverables that depend on actual implementation and agent runs.

## Decision

The lead delegates new cross-cutting decisions to an ADR author before affected work starts. The author reads the assessment and project context defined in [agent roles](../agents.md), checks the working story and existing decisions, and links the sources that led to the proposal. The owner accepts, rejects, or requests revisions. The lead gives implementers the accepted ADR and records its link in the spec and review trail.

[ADR 001](001-country-content.md) covers the required market strategy. Reuse it for forms, plans, and terms. Draft additional ADRs when a decision has material consequences across stories, such as wizard state lifetime, the Strapi read-permission boundary, or QA deployment and promotion. Keep ordinary implementation details in specs, code, or tests.

## Alternatives considered

- **Lead authors every ADR.** Fewer handoffs, but concentrates design and delegation in one session.
- **One ADR per story.** Predictable output, but repeats shared decisions and can create conflicting rules.

## Consequences

The author can identify missing decisions without blocking work already covered by accepted ADRs. Human decisions are attributable. This process adds a handoff for cross-cutting changes.

## Assessment evidence

- **Flow and human control** — [FLOW.md](../../FLOW.md), role definitions, project skill, actual models, agent exports, human approvals and rejections.
- **Specs and decisions** — One agreed spec per story, linked ADRs, acceptance criteria, and resolved questions.
- **Review and verification** — Changed code, test results, findings, verified fixes, and QA verdicts.
- **Application and communication** — Angular and Strapi projects, both market seeds, documented startup, unmet requirements, and public permissions justification in the relevant artifacts. Share the repository with the assessor when authorized. Use fictitious data and exclude credentials.

The planning artifacts exist. Implementation, runtime checks, and actual delivery evidence are pending.
