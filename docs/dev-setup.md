# Development setup — ubuteco-react

## Prerequisites

- Node.js (LTS), npm
- Running **[ubuteco_api](../ubuteco_api)** (REST + AnyCable)
- API dev guide: [ubuteco_api/docs/dev-setup.md](../ubuteco_api/docs/dev-setup.md)

## Environment

Create `.env` in repo root:

```env
API_URL=http://localhost:3000/api
CABLE_URL=ws://localhost:8080/api/cable
```

Use your LAN IP instead of `localhost` when testing from another device on the network.

## Run

```bash
npm install
npm run dev          # default port from Next (often 3000 if free — check terminal)
PORT=3001 npm run dev   # recommended if API uses :3000
```

**Important:** Port 3000 is usually the **Rails API**, not this app. Always read the URL printed by `next dev`.

## Build / lint

```bash
npm run build
npm run lint
```

## After pulling changes

If styles or dark mode look wrong after a merge:

```bash
rm -rf .next
npm run dev
```

## Auth in dev

1. Sign in via `/login` with a user from API seeds or factory.
2. JWT stored in `localStorage` (`ubuteco_auth_token`, `ubuteco_auth_user`).
3. Org-scoped roles without `organization_id` redirect to `/forbidden`.

## Real-time (kitchen)

Kitchen queue uses Action Cable → AnyCable. If WebSocket fails, REST polling may still work but updates won't be live — verify `CABLE_URL` and anycable-go is up.
