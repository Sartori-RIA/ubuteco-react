# Frontend improvement plans

Companion plans for uButeco React (`ubuteco-react`) — **the only active frontend**. Angular `ubuteco_spa` is abandoned; no SPA migration plans.

**AI assistants:** read [AGENTS.md](../../AGENTS.md) first, then [docs/context/](../context/). New plans: [TEMPLATE.md](./TEMPLATE.md) (full rules in API repo).

**Workflow:** updating plans or backlog entries → commit on **`main`** (no PR). Code for a plan → `feature/<slug>` branch. **Before PR:** update plan status on the branch; **small commits** — see [workflow-plans-and-git.md](../workflow-plans-and-git.md).

Backend work: [`ubuteco_api/docs/plans`](../../../ubuteco_api/docs/plans/README.md).

## Tracking

| Layer | Purpose |
|-------|---------|
| **Plan doc** (`docs/plans/`) | Spec, phases, checkboxes — source of truth for scope |
| **Status column (below)** | High-level progress at a glance |
| **GitHub Issue** | Discussion, assignee, link PRs (`Closes #N`) |
| **GitHub Project** | Pipeline columns (Backlog → In progress → In review → Done) |

When a plan gets an issue, add `**GitHub:** owner/repo#NN` to the plan header (see [TEMPLATE.md](./TEMPLATE.md)).

**Plan status values:** `not started` · `in progress` · `completed`

**Task checkboxes inside plans:** `[ ]` not started · `[~]` in progress · `[x]` done

## Suggested implementation order

| # | Plan | Status | Priority | Backend doc |
|---|------|--------|----------|-------------|
| 1 | [Multi-tenant](./01-multi-tenant.md) | in progress | P0 | [API](../../../ubuteco_api/docs/plans/01-multi-tenant.md) |
| 8 | [Settings — account deletion](./08-settings-account-deletion.md) | not started | P1 | [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) |
| 6 | [Organizations UI](./06-organizations-ui.md) | completed | P1 | Organizations API + [02](../../../ubuteco_api/docs/plans/02-locale-and-currency.md) |
| 7 | [Users admin UI](./07-users-ui.md) | in progress | P1 | [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) |
| 5 | [Testing](./05-testing.md) | in progress | P1 | [08-api-contract-ci](../../../ubuteco_api/docs/plans/08-api-contract-and-ci.md) |
| 2 | [Locale & currency](./02-locale-and-currency.md) | completed | P1 | [API](../../../ubuteco_api/docs/plans/02-locale-and-currency.md) |
| 4 | [Organization dashboard](./04-organization-dashboard.md) | completed | P1 | [API](../../../ubuteco_api/docs/plans/04-organization-dashboard.md) |
| 9 | [Frontend performance](./09-frontend-performance.md) | not started | P2 | — |
| 10 | [Browser document titles](./10-document-titles.md) | not started | P2 | — |
| 11 | [Inventory UI](./11-inventory-ui.md) | not started | P2 | [09-inventory-stock](../../../ubuteco_api/docs/plans/09-inventory-stock.md) |
| 12 | [Appearance — dark mode](./12-appearance-dark-mode.md) | completed | P2 | — |
| 13 | [App shell & navigation](./13-app-shell-navigation.md) | completed | P1 | — |
| 14 | [Marketing landing page](./14-landing-page.md) | not started | P2 | — |
| 3 | [Subscription plans](./03-subscription-plans.md) | not started | P2 | [API](../../../ubuteco_api/docs/plans/03-subscription-plans.md) |

Platform hardening (API): [05-platform-hardening](../../../ubuteco_api/docs/plans/05-platform-hardening.md).

## Also see

| Doc | Purpose |
|-----|---------|
| [context/](../context/) | Frontend architecture and folder map |
| [dev-setup.md](../dev-setup.md) | Env vars, ports, dev commands |
| [API plans](../../../ubuteco_api/docs/plans/README.md) | Backend companions |
| [backlog/](../backlog/README.md) | Bugs & small UX fixes (promote to plan when large) |
