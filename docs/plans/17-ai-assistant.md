# Plan: AI assistant chat (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [17-ai-assistant](../../../ubuteco_api/docs/plans/17-ai-assistant.md)  
**Branch:** `feature/ai-assistant`  
**Priority:** P3  
**Depends on:** [16-ai-settings](./16-ai-settings.md), [13-app-shell-navigation](./13-app-shell-navigation.md), API plan 17 Phase 3  
**Estimated effort:** 1–1.5 sprints

---

## Goal

A chat panel where ADMIN and CASH_REGISTER ask questions about their bar ("what sold most yesterday?") and read the answer without leaving the page they are on.

---

## Product decisions (lock before coding)

| Decision | Recommendation (v1) |
|----------|---------------------|
| Entry point | Button in `SidebarLayout` header (chat icon) → **side drawer** over the current page. No dedicated route in v1. |
| Who | `canAccessDashboard()` roles that the API allows (ADMIN, CASH_REGISTER) **and** `useAiEnabled()` |
| Conversations | List of own conversations in the drawer (newest first); "New conversation" button; delete with `ConfirmDialog` |
| Response | v1: wait for full response with a "thinking…" state (API is synchronous). v2: streaming via AnyCable (API Phase 5). |
| Rendering | Plain text + simple Markdown (bold, lists, tables). **No raw HTML.** |
| Suggested prompts | 3–4 starter chips on an empty conversation, translated (e.g. "Yesterday's sales", "What is running low?") |
| Money/dates | Shown as the API/model returns them — do not re-parse numbers from text |
| Mobile | Drawer becomes full screen under `md` breakpoint |

---

## Out of scope (v1)

- Write actions / confirm buttons (API Phase 6)
- Voice input, file attachments
- Sharing conversations between users

---

## Phase 1 — Service & state

- [ ] `src/app/_services/assistant.service.ts`: `listConversations`, `getConversation`, `createConversation`, `sendMessage`, `deleteConversation` via `apiFetch`
- [ ] Types in `src/app/_types/assistant.ts` (`AiConversation`, `AiMessage` with `role: "user" | "assistant"`)
- [ ] Redux feature `src/app/_store/features/assistant/` (drawer open, active conversation, messages, sending flag) — follow `dashboard` slice + thunks pattern
- [ ] MSW handlers for all endpoints

**Acceptance:** thunk tests for send success, `ai_disabled`, `ai_rate_limited`, timeout.

---

## Phase 2 — Drawer UI

- [ ] `src/app/_components/assistant/AssistantDrawer.tsx` (reuse `ModalWrapper` patterns for focus trap / Esc to close)
- [ ] `ConversationList`, `MessageList`, `MessageInput` (Enter sends, Shift+Enter new line, disabled while sending)
- [ ] Markdown renderer with sanitisation (e.g. `react-markdown` without `rehype-raw`)
- [ ] Empty state with starter chips
- [ ] Footer note: "AI-generated answers may contain mistakes" (i18n)
- [ ] Dark mode tokens from `globals.css`

**Acceptance:** keyboard-only usable; screen reader announces new assistant message (`aria-live="polite"`).

---

## Phase 3 — Shell integration & guards

- [ ] Header button in `SidebarLayout` shown only when role allowed and `useAiEnabled()`
- [ ] Add `canUseAssistant()` to `auth-roles.ts` + tests in `auth-roles.test.ts`
- [ ] Close drawer and clear assistant state on logout / org switch

---

## Phase 4 — Errors & limits

- [ ] Map `ai_disabled`, `ai_rate_limited`, `ai_unavailable` to friendly messages (i18n)
- [ ] Rate-limited → disable input with retry hint
- [ ] Failed send keeps the user's text in the input (no lost typing)

---

## Phase 5 — Streaming (v2, after API Phase 5)

- [ ] `useAssistantCable` (mirror `useKitchenCable`; server scopes by JWT — client never sends org id)
- [ ] Append deltas to the last assistant message; show tool status line ("checking sales…")

---

## Phase 6 — Tests & i18n

- [ ] Component tests: send flow, error states, hidden when AI disabled, hidden for WAITER/KITCHEN
- [ ] i18n keys `assistant.*` in `pt-BR`, `en`, `es`, `fr`

---

## Definition of done

- [ ] Allowed roles can chat from any authenticated page
- [ ] Hidden when AI off or role not allowed
- [ ] No HTML injection from model output (test with a `<script>` answer)
- [ ] Lint, tests, coverage, build pass

---

## References

- `src/app/_components/SidebarLayout.tsx`, `ModalWrapper.tsx`, `ConfirmDialog.tsx`
- `src/app/_store/features/dashboard/` (slice + thunks pattern)
- `src/app/_hooks/useKitchenCable.ts` (cable pattern for v2)
- API: [17-ai-assistant](../../../ubuteco_api/docs/plans/17-ai-assistant.md)
