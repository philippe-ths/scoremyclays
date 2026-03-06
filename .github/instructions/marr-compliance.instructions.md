---
description: "MARR compliance — always-on rules for branch verification, issue tracking, and standard selection. Applied to all coding, investigation, and documentation work in this project."
applyTo: "**"
---

# MARR Compliance

The MARR configuration lives at `.claude/marr/MARR-PROJECT-CLAUDE.md`. Follow its directives on every task.

---

## STOP-GATE: Branch Verification (MANDATORY FIRST STEP)

Before any investigation, code read, or change:

1. Check current branch
2. **If on `main`** → STOP. Create a feature branch. Then proceed.
3. **If on a feature branch** → Verify it matches the current issue.

No exceptions. No reading code before branching. Branch first.

---

## Issue Requirement

**Never start implementation without an issue number.** All work must be traceable.

If the user has not provided an issue number, ask before proceeding.

---

## Standard Selection (Before Acting)

Scan the trigger list in `MARR-PROJECT-CLAUDE.md` before every task. Read the full content of each standard whose trigger matches your current task.

| Your task type | Standard to read |
|---|---|
| Starting implementation, debugging | `prj-development-workflow-standard.md` |
| UI components, layouts, styling | `prj-ui-ux-standard.md` |
| Tests, test coverage | `prj-testing-standard.md` |
| Documentation, READMEs | `prj-documentation-standard.md` |
| Git, branches, PRs | `prj-version-control-standard.md` |
| MCP tools, external services | `prj-mcp-usage-standard.md` |
| Prompts, instruction files, CLAUDE.md | `prj-writing-prompts-standard.md` |
| Executing a plan from `plans/` | `prj-plan-execution-standard.md` |

All standards live at `.claude/marr/standards/`.

---

## Anti-Patterns (FORBIDDEN)

- Skipping a triggered standard
- Partial standard reads
- Making any change on `main`
- Treating standards as suggestions — they are requirements
