# Plan: Support impersonation (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [23-support-impersonation](../../../ubuteco_api/docs/plans/23-support-impersonation.md)  
**Branch:** `feature/support-impersonation`  
**Priority:** P2  
**Depends on:** [06-organizations-ui](./06-organizations-ui.md), API plan 23  
**Estimated effort:** 0.5–1 sprint

---

## Goal

A super admin opens a tenant as that user, sees a banner that cannot be missed, and leaves without ever typing or seeing a password. The banner is not the security control. The API denylist is.

---

## Product decisions (lock before coding)

| Decision | Choice (v1) |
|----------|-------------|
| Who | `isSuperAdmin()` only. The button is not rendered for an org admin |
| Where | On the platform organization user list: "Entrar como" opens a reason field, then starts the session |
| Tokens | Keep the super-admin token. Store the support JWT apart from it. Leave restores the super-admin token and calls `DELETE` |
| Banner | Fixed, on every page, with the target name, the organization, the expiry time, and "Sair". It is not dismissible |
| Password UI | While the support JWT is in use, hide password, email, and role fields. A 403 `impersonation_forbidden` still shows an error if a request gets through |
| Expiry | When the API returns 401 for that token, clear it and return to the super-admin session with a short notice |
| Copy | `supportSession.*` in pt-BR, en, es, and a full block in fr |

---

## Out of scope

- Letting an org admin impersonate staff
- A password field "for support"
- Editing the reason after start

---

## Phase 1 — Session client

- [ ] `src/app/_services/impersonation.service.ts`: start, list, leave
- [ ] Store the support token without dropping the super-admin token
- [ ] `apiFetch` sends the support token only while the banner session is active
- [ ] MSW: start 201, 422 super-admin target, 403, leave 204

**Acceptance:** leave puts the super-admin token back. The target password is never in the client state.

---

## Phase 2 — Banner and entry

- [ ] Reason dialog, minimum length matched to the API (10)
- [ ] Banner in `SidebarLayout` for the whole app, including catalog and orders
- [ ] Hide the settings password block, email field, and role field while impersonating
- [ ] Platform user list shows the action only for a super admin

**Acceptance:** a cash-register or admin user does not see "Entrar como". During a session the password field is absent. Sair returns to the platform screen.

---

## Phase 3 — Tests and i18n

- [ ] Banner renders the target and the leave button
- [ ] Leave restores the previous session in the test store
- [ ] Titles unchanged except the banner text. No new top-level route required if the flow lives on the platform organization page

---

## Definition of done

- [ ] Super admin can enter as a tenant user and leave
- [ ] The password is never shown or edited in that session
- [ ] The banner stays until leave or expiry
- [ ] Lint, tests, and build pass

---

## References

- `src/app/_lib/auth-roles.ts` (`isSuperAdmin`)
- `src/app/_services/api-fetch.ts`
- `src/app/settings/page.tsx` (password fields to hide)
- API: [23-support-impersonation](../../../ubuteco_api/docs/plans/23-support-impersonation.md)
