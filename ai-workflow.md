# AI Workflow

This file defines the workflow for AI-assisted coding on this project.
It is written for the AI coding agent.
The human reviews and approves at defined checkpoints.

Follow this workflow for every implementation task.
Do not skip steps.
Do not reorder steps.
The issue provides intent.
The codebase provides implementation truth.
Runtime behaviour is the final source of truth.

## Workflow Overview

1. **Confirm the task and inputs.**
   - Confirm the GitHub issue number and read the issue.
   - Search for issues that reference or are referenced by the issue to identify possible parent, child, or related sub-issues when direct sub-issue relationship data is unavailable.
   - If the issue has sub-issues, stop and ask which sub-issue to work on. See [Handling Parent and Sub-Issues](#handling-parent-and-sub-issues).
   - If the issue is a sub-issue, read the parent issue for context.
   - Confirm the current branch is not `main`.
   - Confirm the current branch name is relevant to the issue being worked on.
   - Confirm the task is clear enough to define a bounded change.
   - If any input is missing or unclear, stop and ask before continuing. Do not proceed to planning, analysis, or implementation.
   - Work produced before resolving input blockers may be discarded.

2. **Review project context.**
   - Read `project-spec.md` and any files relevant to the task.
   - Review the areas of the codebase the task is likely to touch.
   - Human ensures the right context is available.
   - Treat the issue goal as authoritative, but treat suggested implementation details as provisional until confirmed against the current codebase.
   - Do not assume the files, data flow, or control points named in the issue are the real execution path.
   - If the issue and the current codebase disagree, prioritise the codebase and flag the mismatch to the human.
   - Verify all issue-suggested implementation details against the current codebase before relying on them.
   - If the issue suggests a structure that the current codebase does not follow, plan against the real structure and flag the mismatch.
   - If the issue is implementation-specific, extract the intended outcome before planning the change.
   - Extract the intended outcome from the issue before using any implementation suggestions.

3. **Produce a code-aware plan.**
   - Write the plan. See [Planning Requirements](#planning-requirements).
   - The plan must be grounded in the actual codebase, not speculative.

4. **Review the plan.**
   - Human reviews and approves, revises, or rejects the plan.
   - Update the plan if the human requests changes.
   - Do not write code until the plan is approved.

5. **Implement the approved scope.**
   - Implement the work defined in the approved plan.
   - Human monitors for drift.
   - See [Implementation Rules](#implementation-rules) and [Scope Control](#scope-control).

6. **Run validation.**
   - Run validation checks. See [Validation Requirements](#validation-requirements).
   - Report results clearly.
   - Human reviews the results.

7. **Support manual verification.**
   - Suggest specific things the human should verify, based on the change.
   - Manual verification is a primary source of truth for user-visible behaviour, not a final formality.
   - Stop and wait for the human to confirm before continuing, even if the change appears trivial.
   - Human performs manual checks where needed, or confirms no manual checks are required.
   - When suggesting manual checks, include the exact success signal and the exact failure signal.
   - If a manual check fails, restate the contradiction before proposing the next step.
   - If a manual check fails, do not convert the failed check into a request for the human to repeat the same check unless new evidence justifies the retry.

8. **Fix and revalidate.**
   - Human reports issues found during manual verification or review.
   - Fix the reported issues.
   - Rerun relevant validation checks after each fix.
   - Repeat until no issues remain.
   - Do not stack multiple speculative fixes without new evidence between them.
   - After a failed manual check, each new fix must be tied to a specific hypothesis.
   - If repeated fixes are attempted under the same theory without changing the evidence, stop and reassess the theory.
   - A retry of the same user flow counts as a new validation step only if new evidence has been gathered or the relevant hypothesis has changed.

9. **Summarise and close.**
   - Report: what changed, what was tested, what was not tested, and any remaining risks or follow-up work.
   - Flag any follow-up work the change surfaced but that is out of scope.
   - Update `project-spec.md` if the work changes domain concepts, scope, constraints, or architecture.
   - Update relevant files in `docs/` if the work changes behaviour, structure, or workflow assumptions.
   - If this is the last open sub-issue under a parent issue, flag this to the human.
   - Do not push or create a pull request without explicit human confirmation.
   - Suggest creating a pull request when the work appears complete, but wait for the human to confirm before proceeding.
   - Human reviews the PR and decides whether the work is complete.

## Planning Requirements

Before implementation, produce a plan that includes:

- The goal of the change in one or two sentences.
- The user-visible behaviour that must change, not only the code changes proposed.
- The files and areas of the codebase the change will touch.
- The proposed implementation approach.
- Any assumptions the plan depends on.
- List the assumptions that come from the issue separately from assumptions confirmed in the codebase.
- For each critical assumption, state how it will be verified.
- Any uncertainties or ambiguities that remain.
- Risks and edge cases.
- If the change affects routing, persistence, sync, caching, reactive subscriptions, or state transitions, mark it as a higher-risk change.
- For higher-risk changes, include at least one runtime validation step that proves the intended user behaviour.
- Validation approach. See [Validation Requirements](#validation-requirements).
- Any logging or observability changes needed. See [Logging and Observability](#logging-and-observability).

When writing the plan:

- Do not treat issue-proposed file edits as requirements unless the current codebase confirms them.
- Keep the plan concise.
- Do not produce long speculative plans.
- Ground every point in what exists in the codebase today.

## Implementation Rules

During implementation:

- Use `project-spec.md` as the reference for architectural patterns, project structure, and conventions.
- Prefer extending current patterns over introducing new ones.
- Keep changes focused and relevant to the approved plan.
- Avoid unrelated cleanup, refactoring, or opportunistic rewrites unless explicitly approved.
- Do not add new dependencies unless approved.
- Do not change existing architecture, data flow, or project conventions unless approved.

## Scope Control

Keep the change focused on the approved task:

- Do only the work required to complete the task.
- Do not expand scope based on assumptions.
- Do not bundle in adjacent improvements unless explicitly approved.
- Do not treat "while I am here" changes as free.
- Separate fixes, refactors, and feature work unless the task clearly requires them together.
- If a larger problem is discovered, flag it as a follow-up instead of silently broadening the implementation.

## Validation Requirements

Run the following checks after every code change, in order:

1. **Smoke tests.** Confirm the app builds and starts without errors.
2. **Global test suite.** Run the full existing test suite. Report any failures, including failures unrelated to the change.
3. **Targeted tests.** Run tests specific to the changed area. If no targeted tests exist, flag this.
4. **New tests.** If the change introduces behaviour that is not covered by existing tests, add tests. Run them and report results.

When running validation:

- Do not modify smoke tests or the global test suite unless the task explicitly requires it.
- Run smoke tests and the global test suite after each meaningful implementation pass, not only at the end of the task.
- Do not treat passing smoke tests and the global test suite as proof that the requested behaviour works.
- Treat existing passing tests as evidence of stability, not proof of correctness for the new behaviour.
- When the change affects state transitions, sync, routing, caching, or reactive UI updates, include validation that follows the full user path.
- If no automated test exercises the real user path, say so explicitly.
- If manual verification fails, stop implementation mode and enter failure analysis mode before making more code changes.

Report clearly:

- What was tested and what passed.
- What failed and whether the failure is related to the change.
- What was not tested and why.
- Do not claim completion if relevant tests are failing.

## Failure Analysis Mode

Enter failure analysis mode when manual verification fails, runtime behaviour contradicts the implementation, or test results conflict with observed behaviour.

When in failure analysis mode:

- Stop making speculative fixes until the contradiction is described clearly.
- State the observed behaviour in user terms.
- State the expected behaviour in user terms.
- Restate the contradiction in one short block before any reasoning.
- Use the format: observed behaviour, expected behaviour, strongest conflicting evidence, and what remains unknown.
- List the assumptions the implementation relied on.
- Mark each assumption as verified, unverified, or disproved.
- List plausible failure causes across issue interpretation, code path selection, persistence, sync, caching, routing, UI binding, environment, test coverage, and observability.
- Identify the cheapest next observation that can eliminate one or more hypotheses.
- When multiple hypotheses exist, prefer the next observation that distinguishes between wrong code path, wrong write, later overwrite, sync overwrite, and stale runtime.
- Before proposing the next step, name the single leading hypothesis and the evidence that currently supports it.
- If the contradiction involves a write, state transition, sync boundary, or reactive screen, prefer temporary diagnostics or direct observation over a retry request.
- Gather evidence before proposing another fix.
- Do not claim the issue is nearly complete while the root cause is still unknown.
- Do not ask the human to retry the flow, refresh the app, clear cache, restart the dev server, or repeat manual verification until at least one concrete hypothesis has been tested with new evidence.
- Do not treat environment or caching as the leading explanation unless evidence makes it more likely than code path, persistence, sync, routing, or UI binding failures.

## Logging and Observability

Consider whether additional logging or observability is needed when the change introduces user-facing flows, data writes, sync operations, state transitions, error handling paths that could fail silently, or integration points between layers.

When adding logging:

- Use the project's existing logging approach. If none exists, flag this in the plan.
- Log the action, relevant identifiers, and outcome (success or failure).
- Include enough context to trace a problem without a debugger.
- Do not add logging for trivial operations or where it would expose sensitive user data.
- Do not log full data payloads unless explicitly needed.
- Do not introduce a new logging library or pattern without approval.
- When a change affects writes, sync behaviour, state transitions, or reactive screens, decide explicitly whether temporary diagnostic logging is needed to verify the runtime path.
- Prefer logs or probes that confirm which code path executed, which identifiers were used, and which state transition occurred.
- If observability is too weak to distinguish between competing hypotheses, flag that before continuing.
- Remove temporary diagnostics before completion unless the human approves keeping them.
- For higher-risk changes, if manual verification fails and the runtime path is not yet proven, decide whether temporary diagnostics or another direct observation method is needed before asking the human to retry.

When investigating root causes or verifying runtime behaviour, prefer automated diagnostics over asking the human to observe and report:

- Write diagnostics that capture structured, non-sensitive output such as event types, state changes, control flow decisions, and timestamps.
- Diagnostics must never output sensitive data. No tokens, credentials, PII, full payloads, or anything that could identify a real user.
- Run the diagnostic, read the results, and use them to drive the next step without waiting for human involvement.
- If a diagnostic cannot avoid capturing sensitive data, do not write it. Describe what to look for and let the human observe it directly.
- Only ask the human to provide logs or reproduce behaviour when automated observation is not possible.

## GitHub Workflow

Every task must follow the GitHub branching workflow:

- Every task must be linked to a GitHub issue.
- Do not work directly on `main`.
- Create a branch for the issue before starting work.
- If the branch name does not match the issue or task, stop and create or switch to an appropriate branch before continuing.
- Branch naming format: `type/short-description`. Use `feature/` for new functionality, `fix/` for bug fixes, `refactor/` for refactors.
- Keep branch work focused on the issue scope.
- If the task changes significantly during implementation, update the issue or flag the mismatch.

## Handling Parent and Sub-Issues

Some work may be organised into parent issues and sub-issues in GitHub. When this structure is used:

- A parent issue provides broader context and may list sub-issues.
- A sub-issue is a single bounded work item.
- If the provided issue is a parent issue with sub-issues, do not implement the full parent scope. Stop and ask which sub-issue to work on.
- If the provided issue is a sub-issue, read the parent issue for context and implement only the sub-issue scope.
- If the provided issue has no sub-issues, treat it as a standalone work item.
- When completing a sub-issue, check whether it is the last open sub-issue under the parent. If it is, flag this to the human.

## Ask First

Stop and ask the human before doing any of the following:

- Adding a new dependency.
- Changing architecture or established patterns.
- Changing database schema or sync-related behaviour.
- Changing public interfaces or shared contracts.
- Making broad refactors.
- Deleting files or removing significant code paths.
- Weakening, skipping, or removing tests.
- Introducing new conventions or changing existing ones.
- Making assumptions where the task or expected behaviour is unclear.
- Proceeding when the work conflicts with the current codebase or project constraints.

## Never Do

Do not do any of the following under any circumstances:

- Work directly on `main`.
- Implement without a confirmed issue number.
- Invent requirements not present in the task or project context.
- Silently expand scope.
- Introduce unrelated changes without approval.
- Claim code is tested when it is not.
- Ignore failing tests and continue as if the task is complete.
- Make architectural changes without approval.
- Hide uncertainty, guessed behaviour, or incomplete validation.
- Push to remote or create a pull request without explicit human confirmation.
- Write diagnostics that output sensitive data, including tokens, credentials, PII, full payloads, or anything that could identify a real user.
- Hardcode sensitive values.

## Human and AI Responsibilities

### The human is responsible for:

- Defining and scoping the task before it reaches the AI.
- Decomposing larger work into sub-issues and providing a sub-issue (not the parent) as the starting input.
- Providing a well-formed GitHub issue as the starting input.
- Ensuring the right project context is available.
- Reviewing and approving the plan before coding starts.
- Monitoring for scope drift during implementation.
- Performing manual verification where automated tests are not sufficient.
- Reporting issues found during review or testing.
- Deciding when the work is complete.

### The AI is responsible for:

- Confirming inputs before starting work.
- Reviewing project context and the relevant codebase.
- Producing a code-aware plan that is grounded in the actual codebase.
- Implementing only the approved scope.
- Running validation after every code change and reporting results clearly and honestly.
- Suggesting what the human should verify manually.
- Fixing reported issues and revalidating.
- Flagging follow-up work that surfaced during implementation.
- Updating `project-spec.md` and `docs/` when the work changes behaviour, structure, or conventions.
- Suggesting a pull request when the work appears complete, and creating it once the human confirms.
- Summarising what changed, what was tested, and what risks remain.
- Stopping and asking when anything is unclear, risky, or out of scope.