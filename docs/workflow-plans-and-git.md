# Workflow: plans, commits, and PRs

**Canonical source** for plan/git workflow in uButeco — use this file for any agent or human.

| Copy | Audience |
|------|----------|
| **This file** (`docs/workflow-plans-and-git.md`) | Source of truth — Copilot, Claude, CI, humans |
| [`.cursor/rules/plan-and-git-workflow.mdc`](../.cursor/rules/plan-and-git-workflow.mdc) | Cursor-only summary (`alwaysApply`); keep in sync with this doc |
| [AGENTS.md](../AGENTS.md) | Entry point — links here in *Before you code* |

When editing workflow rules, **change this file first**, then mirror to `.cursor/rules/`.

## Flow

```
Read plan → feature/<slug> branch → small commits → update plan → push → open PR
```

## 1. Start

- Pick **one** plan from [docs/plans/README.md](./plans/README.md).
- Check companion API plan in [ubuteco_api/docs/plans](https://github.com/Sartori-RIA/ubuteco_api/tree/master/docs/plans).
- Branch: `feature/<plan-slug>` (e.g. `feature/inventory-ui`).

## 2. Commits (small)

Prefer **several small commits** over one large dump:

```text
feat(inventory): show stock levels on catalog pages
feat(inventory): add stock adjustment panel
feat(inventory): add low stock page and nav
fix(i18n): translate tables page strings
docs(inventory): mark plan 11 completed
```

**Convention:** `type(scope): imperative summary` — types: `feat`, `fix`, `test`, `docs`, `refactor`.

## 3. Update plan **before** the PR

On the feature branch (same PR as code):

| File | What to update |
|------|----------------|
| `docs/plans/NN-*.md` | Header `Status:`, phase `[x]` / `[~]`, definition of done |
| `docs/plans/README.md` | Status column (`not started` · `in progress` · `completed`) |

Exception: plan/backlog **text-only** edits with no implementation can go straight to **`main`** (no PR), per [AGENTS.md](../AGENTS.md).

## 4. Quality gates **before** opening the PR

Run locally on the feature branch — **must pass** before `git push` / `gh pr create`. Matches [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

| Check | Command |
|-------|---------|
| **ESLint** | `npm run lint` |
| **Tests (Vitest)** | `npm test` |
| **Tests + code coverage** | `npm run test:coverage` |
| **TypeScript + production build** | `NEXT_PUBLIC_API_URL=http://localhost:3000 npm run build` |
| **Plan status drift** (if plan docs changed) | `bin/plans_drift_check` |

Run **`npm test`** locally on every change that touches TS/TSX; run the full row above before push/PR. Optional while developing: `npm run test:watch`.

## 5. Open PR

- One plan per PR when possible; finish the plan in that PR.
- Body: summary bullets, link to plan file, test plan checklist.
- Cross-repo: link companion API PR when the UI depends on new endpoints.

## 6. After merge

- README status should already be `completed` from step 3.
