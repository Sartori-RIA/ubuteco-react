# Testing patterns — React

How to add and run tests in ubuteco-react. Plan reference: [05-testing](../plans/05-testing.md). CI matches [workflow-plans-and-git.md](../workflow-plans-and-git.md) §4.

## Run commands

```bash
npm test                    # Vitest once
npm run test:watch          # watch mode
npm run test:coverage       # coverage (Codecov in CI)
npm run lint
NEXT_PUBLIC_API_URL=http://localhost:3000 npm run build
```

## Stack

- **Vitest** + **Testing Library** (jsdom)
- **MSW** — `src/test/msw/server.ts`, handlers in `handlers.ts`
- Setup: `src/test/setup.ts` (MSW listen/reset/close)

## File layout

| Pattern | Example |
|---------|---------|
| Unit test colocated | `src/app/_lib/auth-roles.test.ts` |
| Service integration | `src/app/_services/users.service.integration.test.ts` |
| Redux slice | `src/app/_store/features/orders/ordersSlice.test.ts` |
| Redux + MSW | `*.integration.test.ts` |

Mirror nearest existing test for the area you change.

## MSW pattern

```typescript
import { http, HttpResponse } from "msw";
import { server } from "@/test/msw/server";

it("loads users", async () => {
  server.use(
    http.get("http://localhost:3000/api/v1/users", () =>
      HttpResponse.json({ data: [], meta: { page: 1 } })
    )
  );
  // ...
});
```

- Base URL in handlers must match `NEXT_PUBLIC_API_URL` used in tests (often `http://localhost:3000/api/...`).
- Unhandled requests **fail** tests (`onUnhandledRequest: "error"`).

## What to test

| Layer | Assert |
|-------|--------|
| `auth-roles.ts` | Role matrix — pure functions, fast |
| `_lib/format*.ts` | Money, dates, org timezone helpers |
| Redux reducers/thunks | State transitions with mocked services |
| Services | MSW integration — request shape, no `organization_id` in query when forbidden |
| Pages (optional) | Render + role guard via mocked auth state |

Playwright E2E is **deferred** — manual smoke path in plan 05.

## Auth in tests

- Mock `getAuthToken` / Redux `auth` slice state as needed
- Test `AuthGuard` behaviour indirectly via role helper unit tests (preferred)

## Coverage

`vitest.config.ts` scopes coverage to business-logic paths. Avoid dropping coverage on changed modules without reason.

## AI checklist for new features

- [ ] Unit tests for new pure helpers
- [ ] MSW handler if new `apiFetch` endpoint
- [ ] `auth-roles.test.ts` update if new route restrictions
- [ ] i18n keys added to message files
- [ ] `npm run lint` + `npm test` + build before PR

## References

- `src/test/setup.ts`, `src/test/msw/`
- [05-testing.md](../plans/05-testing.md)
- API testing mirror: [ubuteco_api/docs/context/testing.md](../../../ubuteco_api/docs/context/testing.md)
