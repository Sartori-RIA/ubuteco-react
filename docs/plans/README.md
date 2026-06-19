# Frontend improvement plans

Companion plans for uButeco React (`ubuteco-react`) — **the only active frontend**. Angular `ubuteco_spa` is abandoned; no SPA migration plans.

**AI assistants:** read [AGENTS.md](../../AGENTS.md) first (includes [workflow-plans-and-git.md](../workflow-plans-and-git.md) — canonical for all agents), then [docs/context/](../context/). New plans: [TEMPLATE.md](./TEMPLATE.md) (full rules in API repo).

**Workflow:** updating plans or backlog entries → commit on **`main`** (no PR). Code for a plan → `feature/<slug>` branch. **Before PR:** update plan status on the branch; **small commits** — see [workflow-plans-and-git.md](../workflow-plans-and-git.md).

Backend work: [`ubuteco_api/docs/plans`](../../../ubuteco_api/docs/plans/README.md).

**Subscription / billing:** [03 Subscription plans](./03-subscription-plans.md) is **last** — implement only after [01 Multi-tenant](./01-multi-tenant.md), [07 Users admin UI](./07-users-ui.md), and remaining P2 UX plans. Companion API plan: [03-subscription-plans](../../../ubuteco_api/docs/plans/03-subscription-plans.md) (also last on the API side).

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

Ordered by priority. **#3 is deferred to the end** (see note above).

| # | Plan | Status | Priority | Backend doc |
|---|------|--------|----------|-------------|
| 1 | [Multi-tenant](./01-multi-tenant.md) | in progress | P0 | [API](../../../ubuteco_api/docs/plans/01-multi-tenant.md) |
| 7 | [Users admin UI](./07-users-ui.md) | completed | P1 | [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) |
| 8 | [Settings — account deletion](./08-settings-account-deletion.md) | completed | P1 | [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) |
| 6 | [Organizations UI](./06-organizations-ui.md) | completed | P1 | Organizations API + [02](../../../ubuteco_api/docs/plans/02-locale-and-currency.md) |
| 5 | [Testing](./05-testing.md) | completed | P1 | [08-api-contract-ci](../../../ubuteco_api/docs/plans/08-api-contract-and-ci.md) |
| 2 | [Locale & currency](./02-locale-and-currency.md) | completed | P1 | [API](../../../ubuteco_api/docs/plans/02-locale-and-currency.md) |
| 4 | [Organization dashboard](./04-organization-dashboard.md) | completed | P1 | [API](../../../ubuteco_api/docs/plans/04-organization-dashboard.md) |
| 13 | [App shell & navigation](./13-app-shell-navigation.md) | completed | P1 | — |
| 11 | [Inventory UI](./11-inventory-ui.md) | completed | P2 | [09-inventory-stock](../../../ubuteco_api/docs/plans/09-inventory-stock.md) |
| 12 | [Appearance — dark mode](./12-appearance-dark-mode.md) | completed | P2 | — |
| 10 | [Browser document titles](./10-document-titles.md) | completed | P2 | — |
| 9 | [Frontend performance](./09-frontend-performance.md) | in progress | P2 | — |
| 14 | [Marketing landing page](./14-landing-page.md) | in progress | P2 | — |
| 15 | [Product expiry alerts](./15-product-expiry-alerts.md) | not started | P2 | [15-product-expiry-alerts](../../../ubuteco_api/docs/plans/15-product-expiry-alerts.md) |
| 3 | [Subscription plans](./03-subscription-plans.md) | not started | **Last** | [API](../../../ubuteco_api/docs/plans/03-subscription-plans.md) |

## Recent merges (Jun 2026)

| Plan | PR | Notes |
|------|-----|-------|
| [08 Settings — account deletion](./08-settings-account-deletion.md) | [#28](https://github.com/Sartori-RIA/ubuteco-react/pull/28) | Danger zone only for org admin; staff/super-admin guidance |
| [11 Inventory UI](./11-inventory-ui.md) | [#26](https://github.com/Sartori-RIA/ubuteco-react/pull/26) | Stock display, adjust panel, `/inventory`, i18n follow-ups |
| [02 Locale & currency](./02-locale-and-currency.md) | [#27](https://github.com/Sartori-RIA/ubuteco-react/pull/27) | `es`, `fr`, `fr-CA`, `en-CA`; CAD + LATAM pesos; Brazil/Canada/EU timezones; order status UX |
| [10 Browser document titles](./10-document-titles.md) | [#31](https://github.com/Sartori-RIA/ubuteco-react/pull/31) | `useDocumentTitle`, `page-titles`, entity titles on detail/edit routes |

**In progress:** [01 Multi-tenant](./01-multi-tenant.md) (Phases 3–4), [09 Frontend performance](./09-frontend-performance.md), [14 Marketing landing page](./14-landing-page.md).

**Next up:** [15 Product expiry alerts](./15-product-expiry-alerts.md). **Last:** [03 Subscription plans](./03-subscription-plans.md).

Platform hardening (API): [05-platform-hardening](../../../ubuteco_api/docs/plans/05-platform-hardening.md).

## Also see

| Doc | Purpose |
|-----|---------|
| [context/](../context/) | Architecture, auth, catalog, i18n, testing, pitfalls |
| [context/common-ai-pitfalls.md](../context/common-ai-pitfalls.md) | Frequent agent mistakes |
| [context/testing.md](../context/testing.md) | Vitest, MSW, coverage |
| [dev-setup.md](../dev-setup.md) | Env vars, ports, dev commands |
| [API plans](../../../ubuteco_api/docs/plans/README.md) | Backend companions |
| [API context](../../../ubuteco_api/docs/context/) | Backend domain reference |
| [backlog/](../backlog/README.md) | Bugs & small UX fixes (promote to plan when large) |
