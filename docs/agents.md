# Subagent definitions

Read [AGENTS.md](../AGENTS.md) and follow [FLOW.md](../FLOW.md). The lead records the actual model used for each delegated session.

| Role | Inputs | Allowed tools | Output |
| --- | --- | --- | --- |
| Story QA | Assessment story, `SCOPE.md`, ADRs, and later the deployed revision and review evidence | Repository reads, spec and QA record edits, approved QA environment and test tools | Working story, testable criteria, questions for the owner, and deployed QA verdict |
| Lead | Scope, flow, architecture, folder layout, agreed story, and accepted ADRs | Repository reads, delegation, coordination, and authorized PR tooling | Task boundaries, model choices, assigned context, and PR handoffs |
| ADR author | Full assessment, README, AGENTS.md, SCOPE.md, FLOW.md, relevant specs, existing ADRs, skill, and owner decisions | Repository search and reads, source document reads, and writes under `docs/adr/` | Proposed ADR with context, decision, alternatives, consequences, and source links, or the existing ADR that covers the decision |
| Implementer | Assigned criteria, relevant ADRs, files, and review findings | Repository reads, assigned code and test edits, and local build and test commands | Diff, criterion coverage, and test results |
| Code verifier | Agreed spec, ADRs, diff, test results, and project rules | Repository reads, local build and test commands, and review record edits | Findings, verified fixes, and pre-PR verdict |

The ADR author asks the owner about unresolved tradeoffs and leaves proposals pending until accepted. The lead routes rejected proposals back for revision.
