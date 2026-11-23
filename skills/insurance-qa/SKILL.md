---
name: insurance-qa
description: Review Sura insurance story criteria, independently verify an implementation diff, or test a deployed QA increment. Use the section for the assigned QA role and stage.
---

# Insurance QA

Use the [insurance story skill](../insurance-story/SKILL.md), [workflow](../../FLOW.md), and [story records](../../docs/story-records.md). Carry the criterion IDs and revision through the review. Record each check's observed result or blocker.

## Before implementation · Story QA

Compare the story with its source, scope, technical requirements, and accepted ADRs. For each criterion, identify the fixture or starting state, user action, and observable result. Surface ambiguities that change behavior for the owner and record the spec decision and revision. Record any authorized partial start and the outstanding decisions.

## Before the PR · Code verifier

Independently inspect the assigned diff against the agreed spec and run relevant repository checks. Cover the normal entry point and the highest-risk failure case. Record the reviewed paths or commit, commands, results, findings, and affected criteria in the review record. Route fixes to the implementer and rerun affected checks before recording readiness.

For startup changes, use the documented command in a clean environment and verify seeds for both markets. For access changes, check public permissions against their documented justification and inspect browser-bound config for write-capable Strapi tokens.

## After deployment · Story QA

Confirm the deployed revision and run the acceptance cases with fictitious data. For market-dependent behavior, use distinct published fixtures for both markets. For content changes, cover an unavailable or draft entry while the other market has published content. When a change touches wizard navigation, verify state isolation and back navigation. For UI changes, exercise keyboard access, visible focus, accessible labels, and mobile and desktop layouts. Use the full wizard end-to-end check required by the assessment when verifying the completed flow.

Record the environment, revision, criterion results, and QA verdict. Route failures through the lead. Reserve a deployed QA verdict for observed results from the deployed revision. The owner decides unresolved business behavior and humans approve merges under [project rules](../../AGENTS.md#branch-flow).
