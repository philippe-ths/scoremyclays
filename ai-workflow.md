# AI Workflow

This file defines the workflow for AI-assisted coding on this project.
It is written for the AI coding agent.
The human reviews and approves at defined checkpoints.

Follow this workflow for every implementation task.
Do not skip steps.
Do not reorder steps.

## Workflow Overview

1. **Confirm the task and inputs.**
   - AI confirms the GitHub issue number and reads the issue.
   - If the issue has sub-issues, stop and ask which sub-issue to work on. See [Handling Parent and Sub-Issues](#handling-parent-and-sub-issues).
   - If the issue is a sub-issue, read the parent issue for context.
   - AI confirms the current branch is not `main`.
   - AI confirms the current branch name is relevant to the issue being worked on.
   - AI confirms the task is clear enough to define a bounded change.
   - If any input is missing or unclear, stop and ask before continuing.

2. **Review project context.**
   - AI reads `project-spec.md` and any files relevant to the task.
   - AI reviews the areas of the codebase the task is likely to touch.
   - Human ensures the right context is available.

3. **Produce a code-aware plan.**
   - AI writes the plan. See [Planning Requirements](#planning-requirements).
   - The plan must be grounded in the actual codebase, not speculative.

4. **Review the plan.**
   - Human reviews and approves, revises, or rejects the plan.
   - AI updates the plan if the human requests changes.
   - Do not write code until the plan is approved.

5. **Implement the approved scope.**
   - AI implements the work defined in the approved plan.
   - Human monitors for drift.
   - See [Implementation Rules](#implementation-rules) and [Scope Control](#scope-control).

6. **Run validation.**
   - AI runs validation checks. See [Validation Requirements](#validation-requirements).
   - AI reports results clearly.
   - Human reviews the results.

7. **Support manual verification.**
   - AI suggests specific things the human should verify, based on the change.
   - AI stops and waits for the human to confirm before continuing, even if the change appears trivial.
   - Human performs manual checks where needed, or confirms no manual checks are required.

8. **Fix and revalidate.**
   - Human reports issues found during manual verification or review.
   - AI fixes the reported issues.
   - AI reruns relevant validation checks after each fix.
   - Repeat until no issues remain.

9. **Summarise and close.**
   - AI reports: what changed, what was tested, what was not tested, and any remaining risks or follow-up work.
   - AI flags any follow-up work the change surfaced but that is out of scope.
   - If this is the last open sub-issue under a parent issue, flag this to the human.
   - AI updates `project-spec.md` if the work changes domain concepts, scope, constraints, or architecture.
   - AI updates relevant files in `docs/` if the work changes behaviour, structure, or workflow assumptions.
   - Do not push or create a pull request until the human confirms the work is ready.
   - If the human confirms the work is ready, the AI may create a pull request for review.
   - Human reviews the PR and decides whether the work is complete.

## Planning Requirements

Before implementation, produce a plan that includes:

- The goal of the change in one or two sentences.
- The files and areas of the codebase the change will touch.
- The proposed implementation approach.
- Any assumptions the plan depends on.
- Any uncertainties or ambiguities that remain.
- Risks and edge cases.
- Validation approach. See [Validation Requirements](#validation-requirements).
- Any logging or observability changes needed. See [Logging and Observability](#logging-and-observability).

Keep the plan concise.
Do not produce long speculative plans.
Ground every point in what exists in the codebase today.

## Implementation Rules

During implementation:

- Use `project-spec.md` as the reference for architectural patterns, project structure, and conventions.
- Prefer extending current patterns over introducing new ones.
- Keep changes focused and relevant to the approved plan.
- Avoid unrelated cleanup, refactoring, or opportunistic rewrites unless explicitly approved.
- Do not add new dependencies unless approved.
- Do not change existing architecture, data flow, or project conventions unless approved.

## Scope Control

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

Smoke tests and the global test suite must not be modified unless the task explicitly requires it.
Run smoke tests and the global test suite after each meaningful implementation pass, not only at the end of the task.

Report clearly:
- What was tested and what passed.
- What failed and whether the failure is related to the change.
- What was not tested and why.

Do not claim completion if relevant tests are failing.

## Logging and Observability

Consider whether additional logging or observability is needed when the change introduces user-facing flows, data writes, sync operations, state transitions, error handling paths that could fail silently, or integration points between layers.

Do not add logging for trivial operations or where it would expose sensitive user data.

Rules:
- Use the project's existing logging approach. If none exists, flag this in the plan.
- Log the action, relevant identifiers, and outcome (success or failure).
- Include enough context to trace a problem without a debugger.
- Do not log full data payloads unless explicitly needed.
- Do not introduce a new logging library or pattern without approval.

## GitHub Workflow

- Every task must be linked to a GitHub issue.
- Do not work directly on `main`.
- Create a branch for the issue before starting work.
- If the branch name does not match the issue or task, stop and create or switch to an appropriate branch before continuing.
- Branch naming format: `type/short-description`. Use `feature/` for new functionality, `fix/` for bug fixes, `refactor/` for refactors.
- Keep branch work focused on the issue scope.
- If the task changes significantly during implementation, update the issue or flag the mismatch.

## Handling Parent and Sub-Issues

Some work may be organised into parent issues and sub-issues in GitHub.

When this structure is used:

- A parent issue provides broader context and may list sub-issues.
- A sub-issue is a single bounded work item.

Rules:

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
- Creating a pull request for review.
- Summarising what changed, what was tested, and what risks remain.
- Stopping and asking when anything is unclear, risky, or out of scope.