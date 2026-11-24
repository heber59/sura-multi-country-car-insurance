# Story records

Use the same story ID in the spec, implementation branch or PR, and review record.

## Spec

Save as `docs/specs/<story-id>.md` before implementing.

- Link the original story or quote it if it has no URL.
- List observable acceptance criteria with IDs such as AC1.
- Link governing ADRs and identify any open questions.
- Record approval and the approved revision.

## Review

Save as `docs/reviews/<story-id>.md`.

- Link the spec, ADRs, and implementation PR or commit. During local work, record the reviewed diff and changed paths.
- Map each acceptance criterion to implementation and test paths. Record exact test commands and outcomes.
- For each finding, record the affected path, impact, fix reference, and reviewer verification. If there are zero findings, record the checks performed.
- Record the reviewed revision and QA readiness verdict. Refresh affected evidence after fixes.

## QA evidence

Save as `docs/qa/<story-id>.md`. Record spec and increment verdicts, revisions, acceptance results, review link, and reasons for rejection. Link the unedited session exports and record actual models, human sign-offs, and corrections.

## Worked example for US-03 AC2

The owner requested country-specific terms during [project planning](adr/002-conversation-led-planning.md#decision). [ADR 001](adr/001-country-content.md#consequences) requires published terms from the selected market and keeps payment disabled when those terms are unavailable. [US-03 AC2](specs/US-03.md#acceptance-criteria) also requires the customer to accept the displayed terms before paying.

US-03 is a draft. This example describes the evidence to collect when the story runs.

| Role | AC2 check and evidence |
| --- | --- |
| Owner | Approve the spec revision before implementation. Record who decided, the revision, the decision, and the reason. |
| Code verifier | Check market and publication filtering and the payment guard. Link the code and tests in the AC2 review record. Record commands, results, and any verified fixes. |
| Story QA | On the deployed revision, verify `/cl` and `/co` each show their own published terms and payment enables only after acceptance. Give each market draft-only terms in turn while the other market has published terms. Confirm no terms appear and payment stays disabled. Record the revision and results. |
| Human release reviewer | Confirm CI passed and review the AC2 QA verdict. Check that affected tests were rerun if the release PR changed the QA-tested revision. Record the reviewed revision and merge decision. |
