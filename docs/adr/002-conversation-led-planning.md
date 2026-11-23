# ADR 002 — Conversation-led project planning

**Status** — Accepted

## Context

The technical assessment evaluates how we design, operate, and control AI-assisted delivery. We used a Codex conversation to turn assessment requirements and contributor preferences into repository artifacts before application development.

## Decision

Keep [FLOW.md](../../FLOW.md) as the workflow reference and record the decisions that shaped it.

| Conversation decision | Repository result |
| --- | --- |
| The project owner requested English code and docs, readable identifiers, an architecture check before edits, and promotion through dev, QA, and main. | [AGENTS.md](../../AGENTS.md) records these rules and the Angular layout. The owner later made accepted ADRs authoritative and raised the documentation limit to under 400 words. |
| The owner supplied the requirements and scope screenshots, then asked for a read-only comparison with the full assessment. | [README.md](../../README.md) holds the technical table. [SCOPE.md](../../SCOPE.md) defines the wizard. The full assessment informed three draft [story specs](../specs/) and the owner requested country-specific terms in [ADR 001](001-country-content.md). |
| Codex drafted separate spec, implementation, and review roles in [docs/agents.md](../agents.md), then added a QA gate. The owner revised that design. | [FLOW.md](../../FLOW.md) gives one story QA agent ownership of requirements and deployed verification, adds a lead for task and model selection, and keeps independent code verification before PRs. Story QA and the lead both read SCOPE.md. |
| The owner approved safeguards for story changes, CI, and work size. | Humans approve business behavior changes and merge PRs after checks. Sessions target 100–500 changed lines, with documented exceptions above the usual 1,000. The [skill](../../skills/insurance-story/SKILL.md) and [record format](../story-records.md) support handoffs and traceability. |

## Alternatives considered

Separate specification and QA agents offered independent interpretation at intake. One story QA owner reduces handoffs and carries the agreed criteria into deployed verification. A hard line cap offered a simpler limit but could split changes that need joint verification.

## Consequences

The [US-03 AC2 example](../story-records.md#worked-example-for-us-03-ac2) traces the owner's request for country-specific terms through review and QA.

This ADR records planning and human corrections. The original conversation is the source for this summary. During actual story runs, preserve unedited session exports and link the story, spec, ADR, code, tests, review fixes, QA verdict, and human approvals. Application execution and review evidence are still pending.
