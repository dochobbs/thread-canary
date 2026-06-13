# Working Canary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the frontend prototype into a working no-auth canary with a backend-owned demo student, persisted local state, API-backed UI actions, and a production canary server.

**Architecture:** Keep the demo single-tenant and no-auth. A Node HTTP server owns canary state in `.data/canary-state.json`, exposes `/api/*`, and serves the Vite production build from `dist/`. The React app becomes mobile-first and API-backed: the default screen stays focused on Today, while secondary tools remain behind tabs.

**Tech Stack:** Node built-in `http`/`fs`, React 18, TypeScript, Vite, Vitest.

---

## Scope

The canary includes:

- No auth.
- One demo student profile.
- Persistent local JSON state.
- API endpoints for health, canary state, action completion, module activation, memory add, and document add.
- Frontend reads/writes via API instead of local-only state.
- Canary server serving `dist/` and `/api/*`.
- Smoke script that verifies the canary server.

The canary does not include:

- Cloud deployment.
- LLM calls.
- wearable/calendar integrations.
- push notifications.
- multi-user data separation.

## Tasks

### Task 1: Backend Store

Create `server/canaryStore.mjs` and `server/canaryStore.test.mjs`.

Tests must cover:

- Seed state loads when no file exists.
- Action completion persists and appears in returned state.
- Module activation persists and appears in returned state.
- Memory additions persist.

### Task 2: HTTP API And Static Server

Create `server/httpServer.mjs`, `server/index.mjs`, and API tests.

Endpoints:

- `GET /api/health`
- `GET /api/canary-state`
- `POST /api/actions/:id/complete`
- `POST /api/modules/:id/activate`
- `POST /api/memory`
- `POST /api/documents`

The same server must serve `dist/index.html` for app routes.

### Task 3: API-Backed Frontend

Create `src/api/client.ts` and update `src/App.tsx`.

The app must:

- Fetch `/api/canary-state` on load.
- Show loading and API error states.
- Complete actions through `POST /api/actions/:id/complete`.
- Activate modules through `POST /api/modules/:id/activate`.
- Keep the mobile-first focused default surface.

### Task 4: Canary Scripts And Smoke Check

Update `package.json` scripts and `.gitignore`.

Add:

- `server`: runs the canary server against an existing `dist/`.
- `canary`: builds and starts the canary server.
- `smoke:canary`: verifies a running canary.

Create `scripts/smoke-canary.mjs` to verify health, HTML, canary state, action mutation, and module activation.

### Task 5: Verification

Run:

- `npm test`
- `npm run build`
- Start `npm run canary`
- `npm run smoke:canary`
- `git status --short`

Expected result: all commands pass, the canary server is live, and the working tree is clean after commit.
