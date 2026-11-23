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
