# Backend Reference — Chintube Backend

This document describes the backend of the Chintube project (Node + Express + Prisma). It's intended to be machine- and human-friendly so AI assistants and developers can quickly understand, run, and extend the backend.

---

## Quick links / entry points

- `src/app.ts` — Express app, mounts middleware and routes.
- `src/server.ts` — server bootstrap (starts the HTTP server).
- `src/app/lib/auth.ts` — `better-auth` integration and Prisma adapter.
- `src/app/lib/prisma.ts` — Prisma client instantiation.
- `src/app/orm/prisma/schema.prisma` — Prisma schema (models & enums).
- `src/app/routes/index.ts` — API route index (`/api/v1`).
- `src/app/modules/media` — media module (routes, controller, service).
- `src/app/modules/review` — reviews (routes, controller, service).
- `src/app/utils/queryBuilder.ts` — powerful query/filter/pagination helper.
- `src/app/middleware` — `zodValidator`, `globalErrorHandler`, `checkAuth`.

---

## Purpose

This backend implements the core API for a Movie & Series rating portal:

- Media library management (admin): create/update/list media.
- Reviews (users): create, list, edit, delete, approve (admin).
- Authentication using `better-auth` connected to the Prisma models.
- Prisma as ORM with PostgreSQL; migrations included under `src/app/orm/prisma/migrations`.

Use this file to quickly onboard new backend engineers or to instruct an AI assistant how to work with the project.

---

## Prerequisites

- Node.js (recommend v18+)
- pnpm (project uses pnpm)
- PostgreSQL (or a connection string to a Postgres instance)
- Environment variables configured (see below)

---

## Environment variables (required)

The backend expects the following env vars (declared and enforced in `src/app/config/env.config.ts`):

- `NODE_ENV` — `development` | `production` (string)
- `PORT` — port number the server will bind to (string)
- `DATABASE_URL` — Prisma/Postgres connection string (string)
- `BETTER_AUTH_SECRET` — secret used by `better-auth` (string)
- `BETTER_AUTH_URL` — base URL for Better Auth (string)

Example `.env` (DO NOT commit secrets):

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/chintube
BETTER_AUTH_SECRET=changeme-super-secret
BETTER_AUTH_URL=http://localhost:5000
```

---

## Install & quick start

Install dependencies and run the dev server:

```bash
pnpm install
pnpm run generate    # prisma generate (client)
pnpm run migrate     # run migrations: prisma migrate dev
pnpm run dev         # starts server via tsx watch src/server.ts
```

Notes:

- `pnpm run dev` uses `tsx watch src/server.ts` (see `package.json`).
- If you change Prisma schema, run `pnpm run generate` and `pnpm run migrate` as needed.

---

## Important project scripts

- `pnpm run dev` — development server (tsx watch).
- `pnpm run build` — TypeScript compile to `dist`.
- `pnpm run start` — run the compiled `dist/server.js`.
- `pnpm run generate` — `prisma generate` (generate client).
- `pnpm run migrate` — `prisma migrate dev`.
- `pnpm run studio` — open `prisma studio`.

---

## Database & Prisma

- Prisma schema location: `src/app/orm/prisma/schema.prisma` (generator outputs to `src/app/orm/generated/prisma-client`).
- Migrations directory: `src/app/orm/prisma/migrations`.

Common commands:

```bash
# create a new migration (after schema change)
pnpm run migrate

# generate prisma client
pnpm run generate

# inspect DB via Studio
pnpm run studio

# push schema to DB without creating a migration (use carefully)
pnpm run push
```

---

## API overview

Base path: `/api/v1`

Auth endpoints: all auth-related routes are proxied to `better-auth` via `toNodeHandler(auth)` mounted at `/api/auth/*any` (see `src/app.ts`). These are implemented by the `better-auth` library and backed by the Prisma models.

## Validation & Errors

- Validation: `zod` used for request payload validation via `zodValidator` middleware (`src/app/middleware/zodValidator.ts`). Module-level validators live near controllers (e.g., `media.validation.ts`).
- Error handling: `globalErrorHandler` processes `zod` errors, `AppError` instances, and generic errors into structured JSON responses.

Example error shape (Zod validation):

```json
{
  "success": false,
  "message": "Zod Validation Error",
  "errorSources": [{ "path": "title", "message": "Title is required" }]
}
```

---

## Utilities

- `sendResponse(res, { httpStatusCode, success, message, data, meta })` — consistent API responses.
- `QueryBuilder` — advanced filtering/search/pagination utility that supports:
  - `searchTerm` across configured searchable fields
  - nested filtering (`relation.field=value`), range operators `lt|lte|gt|gte|in|notIn`, and operator-style keys (`field(has)`, `field(hasSome)`, `field(gt)` etc., as configured by caller)
  - dynamic includes via `dynamicInclude(includeConfig, defaultInclude?)`

Refer to `src/app/utils/queryBuilder.ts` for full capabilities and examples.

---

## Development notes & recommended improvements

1. Production bootstrap: `src/server.ts` currently only starts the server when `NODE_ENV !== "production"`. This prevents the server from starting in production. Consider changing to always start the server, or use an environment-specific entrypoint.

```ts
// suggested change (src/server.ts)
app.listen(envConfig.PORT, () => {
  console.log(`Server is running on http://localhost:${envConfig.PORT}`);
});
```

2. Add `cors`, `helmet`, and rate-limiting middleware.
3. Provide a `.env.example` with required env vars and a `scripts/seed.ts` to create an admin user for initial setup.
4. Add OpenAPI / Swagger docs for machine-readable API specification (very useful for AI-driven tooling).
5. Add tests (unit + integration) and CI to run `pnpm run build` and `pnpm run migrate` in PRs.

---

## How an AI assistant can help (actionable tasks)

- Scaffold new endpoints, following existing controller/service pattern.
- Add Zod validators alongside any new controller and wire into `zodValidator` middleware.
- Write Prisma schema changes and create migrations (`pnpm run migrate`) and update code to use generated client.
- Implement missing middleware: CORS, helmet, request logging, rate limiting.
- Generate OpenAPI from route metadata or write a `openapi.yaml` using the documented endpoints.

When performing code edits, prefer minimal, focused changes; keep coding style consistent with existing files.

---

## Next steps (suggested)

1. Add `.env.example` file with placeholder values.
2. Create a small `scripts/seed-admin.ts` to ensure an admin user exists.
3. Add CORS/helmet middleware and enable in `src/app.ts`.
4. Create OpenAPI spec and expose it under `/api/docs`.

---

## Remaining work — code vs project.md (backend)

This section maps missing backend work found in the repository to the assignment requirements in `project.md`. Use this checklist to plan implementation.

### A. Gaps discovered in this codebase

- Authentication
  - Registration/login: provided by `better-auth` via `src/app/lib/auth.ts` and exposed at `/api/auth/*any`, but no custom routes for password reset or email flows are present in source. Confirm required custom flows and configure `better-auth` accordingly.
- Media
  - Missing delete/unpublish endpoint: `src/app/modules/media/media.routes.ts` implements GET, POST (create), and PATCH (update) only — add DELETE or publish/unpublish actions.
  - No explicit `streamingPlatform` field (only `streamingUrl` in `src/app/orm/prisma/schema.prisma`) — add a platform field if you need platform-based filtering.
- Reviews & Interactions
  - Comments: Prisma model exists (`Comment`) but no routes/controllers/services implemented. Add `src/app/modules/comment/*` (routes, controller, service, validation).
  - Likes: Prisma model exists (`Like`) but no routes/controllers/services implemented. Add `src/app/modules/like/*`.
  - Watchlist: No model found in the Prisma schema; add a `Watchlist` model and endpoints to save/list/remove items.
- Payments & Transactions
  - Enums for `TransactionType` and `PaymentStatus` exist, but no `Transaction` model or payment integration (Stripe) nor purchase/rental flows or purchase history endpoints.
- Admin & Analytics
  - No admin dashboard endpoints for aggregated metrics (average rating per title, sales/rental reports, pending reviews list beyond basic review listing).
- Infrastructure & Security
  - `src/server.ts` conditionally avoids starting the server in production: this is a bug to fix.
  - No `cors`, `helmet` or rate-limiting middleware configured in `src/app.ts`.
- Dev tooling
  - No `.env.example` or `scripts/seed-admin.ts` for onboarding.
  - No OpenAPI/Swagger documentation or tests/CI present.
- Code quality
  - Several `any` usages in services and controller inputs — tighten TypeScript types for maintainability.

### B. Missing items from `project.md` (assignment requirements)

- Authentication: password reset and account-recovery flows are not implemented explicitly in source (verify if `better-auth` covers them under `/api/auth/*any`).
- Social login: `Account` model exists but provider configuration and UI flows are not present in code; configure `better-auth` providers as required.
- Full Media CRUD: create & update are implemented; missing delete/unpublish and admin content management features.
- Reviews: create/list/update/delete implemented and admin approval (`isApproved`) exists; comments/likes endpoints are missing in API.
- Interaction features: likes, comments, nested replies supported in DB but lacking API implementation; watchlist is absent.
- Payment system: purchase/rent/subscription flows, payment gateway integration, and purchase history endpoints are not implemented.
- Admin analytics: aggregated rating and sales endpoints missing.
- Search & filter: core search exists; consider adding platform and additional sorting/filtering required by the frontend.

### Priority suggestions (what to implement next)

1. Fix `src/server.ts` to start in production and add `cors`/`helmet`/rate-limiting in `src/app.ts`.
2. Add `.env.example` and a `scripts/seed-admin.ts` script.
3. Implement `Comment` and `Like` modules (routes, controllers, services) to enable interactions.
4. Add `Watchlist` model and endpoints.
5. Add `Transaction` model + Stripe integration and purchase/rent endpoints.
6. Add admin analytics endpoints and optionally a small `/api/admin/*` route group.
7. Add OpenAPI spec and basic tests.

---

If you want, I can implement any of the suggested changes now (example: add `.env.example`, fix `src/server.ts` bootstrap, or add CORS/helmet). Tell me which to prioritize.
