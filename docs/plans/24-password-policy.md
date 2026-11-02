# Plan: Password policy (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [24-password-policy](../../../ubuteco_api/docs/plans/24-password-policy.md)  
**Branch:** `feature/password-policy`  
**Priority:** P1  
**Depends on:** [08-settings-account-deletion](./08-settings-account-deletion.md), API plan 24  
**Estimated effort:** 0.5 sprint

Ship with the API plan, before support impersonation.

---

## Goal

The screens stop offering an 8-character password and stop treating a reset code as a casual field. The API remains the check. The UI only keeps people from submitting a password the API will reject, and it asks for the current password when they change it.

---

## Product decisions (lock before coding)

| Decision | Choice (v1) |
|----------|-------------|
| Minimum | 12, shown on signup, reset, settings, and the staff user form |
| Current password | Settings and the staff editor require it when a new password is filled in |
| Reset | The mail link opens a screen that only sets the password. It does not log the person in. There is no 6-digit code field |
| Staff create | No generated password on screen. The form says an email was sent so the person can choose a password |
| Denylist errors | Show `password_too_short`, `password_denied`, `password_pwned`, and `current_password_invalid` from the API |
| Copy | pt-BR, en, es, and a full French block |

---

## Out of scope

- A strength meter with symbols and numbers as requirements
- MFA screens
- Forcing a reset banner for every existing user on the day this ships

---

## Phase 1 — Forms

- [ ] Settings: current password, new password, confirmation. Blank new password still means "leave it"
- [ ] Signup, reset, and user form: `minLength` 12 and the same client check, without blocking a server error
- [ ] Map the new API error codes in `resolve-api-errors`
- [ ] Remove any copy that says the password was generated and written on the page

**Acceptance:** a 9-character password does not submit. Settings without the current password does not submit when a new password is present. An API `password_pwned` or `password_denied` is visible. The reset screen does not start a session.

---

## Phase 2 — Tests and i18n

- [ ] Settings test: mismatch, too short, and current password required
- [ ] Keys in `types.ts`, `en.ts`, `pt-BR.ts`, `es.ts`, and `fr.ts`

---

## Definition of done

- [ ] The four password forms follow the 12-character rule and the API errors, including a breached password
- [ ] The reset screen sets a password and does not open a session
- [ ] Changing a password asks for the current one
- [ ] Lint, tests, and build pass

---

## References

- `src/app/settings/page.tsx`
- `src/app/_lib/resolve-api-errors.ts`
- API: [24-password-policy](../../../ubuteco_api/docs/plans/24-password-policy.md)
