# Plan: AI settings — org opt-in toggle (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [16-ai-foundation](../../../ubuteco_api/docs/plans/16-ai-foundation.md)  
**Branch:** `feature/ai-settings`  
**Priority:** P2  
**Depends on:** API plan 16 Phase 3 (`organizations.ai_enabled`)  
**Estimated effort:** 0.25 sprint

---

## Goal

Let an org **ADMIN** turn AI features on or off for their organization, and give every other screen one shared way to know whether AI is available. When this is off, hide only UI that calls the model. Screens that still work from code stay visible.

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
| When AI is off | Hide model UI only: assistant entry ([17](./17-ai-assistant.md)), restock "Explain" ([19](./19-restock-suggestions.md)), label photo and invoice photo/PDF ([21](./21-ai-product-intake.md)). Keep the daily brief card ([18](./18-ai-daily-brief.md), template text), the restock tab ([19](./19-restock-suggestions.md)), and NF-e XML intake ([21](./21-ai-product-intake.md)). |

---

## Out of scope

- Per-feature toggles (assistant on, brief off, …)
- Usage/cost display for the org (platform-only in API v1)

---

## Phase 1 — Types & service

- [ ] Add `ai_enabled: boolean` to `Organization` type (`src/app/_types`)
- [ ] `organizationsService.update` already handles PATCH — include `ai_enabled` in payload type
- [ ] MSW handler in `src/test/msw/handlers.ts` returns `ai_enabled`

---

## Phase 2 — Settings section

- [ ] `src/app/settings/components/AiSettings.tsx` (mirror `LocaleSettings` structure: load from `useOrganizationSettings`, save via service, update auth user in store)
- [ ] Render in `src/app/settings/page.tsx` only when `isAdmin(user)`
- [ ] API errors via `resolveApiErrorMessages` (`ai_disabled` when global kill switch is off → show "AI unavailable on this server")

**Acceptance:** admin toggles and reload keeps state; waiter does not see the section.

---

## Phase 3 — Shared hook

- [ ] `src/app/_hooks/useAiEnabled.ts` → `boolean`
- [ ] Unit test: false when org missing, false for super admin without org, true when flag on

---

## Phase 4 — i18n & docs

- [ ] Keys `settings.ai.*` in `pt-BR`, `en`, `es`, `fr`
- [ ] Add `docs/context/ai-ui.md` (short): `useAiEnabled`, how AI errors render, "AI output is a suggestion" UI rule
- [ ] Add AI rows to `docs/context/common-ai-pitfalls.md` (show AI UI only behind `useAiEnabled`; never render model output as HTML)

---

## Definition of done

- [ ] Admin can enable/disable AI per org
- [ ] `useAiEnabled()` available and tested
- [ ] i18n in all four locales; `npm run lint`, `npm test`, `npm run build` pass

---

## References

- `src/app/settings/page.tsx`, `src/app/settings/components/LocaleSettings.tsx`
- `src/app/_hooks/useOrganizationSettings.ts`
- `src/app/_lib/auth-roles.ts`
