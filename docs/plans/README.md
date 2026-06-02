# Frontend improvement plans

Companion plans for uButeco React (`ubuteco-react`) — **the only active frontend**. Angular `ubuteco_spa` is abandoned; no SPA migration plans.

**AI assistants:** read [AGENTS.md](../../AGENTS.md) first, then [docs/context/](../context/). New plans: [TEMPLATE.md](./TEMPLATE.md) (full rules in API repo).

**Workflow:** updating plans or backlog entries → commit on **`main`** (no PR). Code for a plan → `feature/<slug>` branch.

Backend work: [`ubuteco_api/docs/plans`](../../../ubuteco_api/docs/plans/README.md).

## Suggested implementation order

| # | Plan | Priority | Backend doc |
|---|------|----------|-------------|
| 1 | [Multi-tenant](./01-multi-tenant.md) | P0 | [API](../../../ubuteco_api/docs/plans/01-multi-tenant.md) |
| 8 | [Settings — account deletion](./08-settings-account-deletion.md) | P1 | [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) |
| 6 | [Organizations UI](./06-organizations-ui.md) | P1 | Organizations API + [02](../../../ubuteco_api/docs/plans/02-locale-and-currency.md) |
| 7 | [Users admin UI](./07-users-ui.md) | P1 | [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) |
| 5 | [Testing](./05-testing.md) | P1 | [08-api-contract-ci](../../../ubuteco_api/docs/plans/08-api-contract-and-ci.md) |
| 2 | [Locale & currency](./02-locale-and-currency.md) | P1 | [API](../../../ubuteco_api/docs/plans/02-locale-and-currency.md) |
| 4 | [Organization dashboard](./04-organization-dashboard.md) | P1 | [API](../../../ubuteco_api/docs/plans/04-organization-dashboard.md) |
| 9 | [Frontend performance](./09-frontend-performance.md) | P2 | — |
| 10 | [Browser document titles](./10-document-titles.md) | P2 | — |
| 11 | [Inventory UI](./11-inventory-ui.md) | P2 | [09-inventory-stock](../../../ubuteco_api/docs/plans/09-inventory-stock.md) |
| 12 | [Appearance — dark mode](./12-appearance-dark-mode.md) | P2 | — |
| 13 | [App shell & navigation](./13-app-shell-navigation.md) | P1 | — |
| 14 | [Marketing landing page](./14-landing-page.md) | P2 | — |
| 3 | [Subscription plans](./03-subscription-plans.md) | P2 | [API](../../../ubuteco_api/docs/plans/03-subscription-plans.md) |

Platform hardening (API): [05-platform-hardening](../../../ubuteco_api/docs/plans/05-platform-hardening.md).

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done

## Also see

| Doc | Purpose |
|-----|---------|
| [context/](../context/) | Frontend architecture and folder map |
| [dev-setup.md](../dev-setup.md) | Env vars, ports, dev commands |
| [API plans](../../../ubuteco_api/docs/plans/README.md) | Backend companions |
| [backlog/](../backlog/README.md) | Bugs & small UX fixes (promote to plan when large) |
