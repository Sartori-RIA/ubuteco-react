# AI in the UI

How screens decide whether to show model features. The org switch lives on `/settings` and is saved as `organizations.ai_enabled`.

## Shared check

```tsx
const aiEnabled = useAiEnabled();
```

`useAiEnabled()` reads `ai_enabled` from the signed-in user's organization in the auth store. It does not call the API. It is false when the user has no organization, including a super admin.

## What stays visible when AI is off

Hide only UI that calls a model: the assistant, restock "Explain", and photo or PDF product intake. Keep the daily brief card (template, no model), the restock tab (the numbers), and NF-e XML import.

## Errors

`apiFetch` throws `ApiError` for `ai_disabled` (403) instead of redirecting to `/forbidden`, so the screen can explain it. Other 403 responses still redirect.

`resolveApiErrorMessages` maps:

| Code | Meaning |
|------|---------|
| `ai_disabled` | AI is off for the org, or the server kill switch is off |
| `ai_rate_limited` | Too many calls |
| `ai_unavailable` | The provider failed |
| `ai_invalid_output` | The model reply failed validation |

## Model output

Treat model text as a suggestion. Render it as text. Do not inject it with `dangerouslySetInnerHTML`.
