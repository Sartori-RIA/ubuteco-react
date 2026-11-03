# Plan: AI settings — org opt-in toggle (frontend)

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [16-ai-foundation](../../../ubuteco_api/docs/plans/16-ai-foundation.md)  
**Branch:** `feature/ai-settings`  
**Priority:** P2  
**Depends on:** API plan 16 Phase 3 (`organizations.ai_enabled`)  
**Estimated effort:** 0.25 sprint

---

## Goal

Let an org **ADMIN** turn AI features on or off for their organization, and give every other screen one shared way to know whether AI is available. When AI is off, hide only model UI (assistant, restock Explain, photo or PDF intake). Keep the daily brief card, the restock tab, and NF-e XML import.

---

## Product decisions (lock before coding)

| Decision | Recommendation (v1) |
|----------|---------------------|
| Where | New **AI** section on `/settings`, below `LocaleSettings` |
| Who sees the toggle | `isAdmin()` only; other roles see nothing |
| Default | Off (API default) |
| Copy | One short paragraph on what is sent to the AI provider (org data needed to answer, no passwords/payment data) + link to `/privacy` |
| Confirmation | `ConfirmDialog` when turning **on** (data-sharing notice); turning off is immediate |
| Shared check | `useAiEnabled()` reads `ai_enabled` from the authenticated user's organization in the store — no extra request |
| When off | Hide model UI only. Daily brief, restock numbers, and NF-e XML stay |

---

## Out of scope

- Per-feature toggles (assistant on, brief off, …)
- Usage/cost display for the org (platform-only in API v1)

---

## Phase 1 — Types & service

- [x] Add `ai_enabled: boolean` to `Organization` type (`src/app/_types`)
- [x] `organizationsService.update` already handles PATCH — include `ai_enabled` in payload type
- [x] MSW handler in `src/test/msw/handlers.ts` returns `ai_enabled`

---

## Phase 2 — Settings section

- [x] `src/app/settings/components/AiSettings.tsx` (mirror `LocaleSettings` structure: load from `useOrganizationSettings`, save via service, update auth user in store)
- [x] Render in `src/app/settings/page.tsx` only when `isAdmin(user)`
- [x] API errors via `resolveApiErrorMessages` (`ai_disabled` when global kill switch is off → show "AI unavailable on this server")

**Acceptance:** admin toggles and reload keeps state; waiter does not see the section.

---

## Phase 3 — Shared hook

- [x] `src/app/_hooks/useAiEnabled.ts` → `boolean`
- [x] Unit test: false when org missing, false for super admin without org, true when flag on

---

## Phase 4 — i18n & docs

- [x] Keys `settings.ai.*` in `pt-BR`, `en`, `es`, `fr`
- [x] Add `docs/context/ai-ui.md` (short): `useAiEnabled`, how AI errors render, "AI output is a suggestion" UI rule
- [x] Add AI rows to `docs/context/common-ai-pitfalls.md` (show AI UI only behind `useAiEnabled`; never render model output as HTML)

---

## Definition of done

- [x] Admin can enable/disable AI per org
- [x] `useAiEnabled()` available and tested
- [x] i18n in all four locales; `npm run lint`, `npm test`, `npm run build` pass

---

## References

- `src/app/settings/page.tsx`, `src/app/settings/components/LocaleSettings.tsx`
- `src/app/_hooks/useOrganizationSettings.ts`
- `src/app/_lib/auth-roles.ts`
