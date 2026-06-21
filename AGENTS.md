# AGENTS.md

## Repository Overview

This repository contains an Express + TypeScript API for CRM lead processing and webhook ingestion. The main runtime entry point is [src/server.ts](src/server.ts), and application setup lives in [src/app.ts](src/app.ts).

## Important Conventions

- Use TypeScript strict mode and keep code compatible with the current `tsconfig.json` settings.
- Follow the existing folder pattern:
  - `*.routes.ts` for HTTP handlers
  - `*.service.ts` for business logic
  - `*.repository.ts` for database access
  - `*.schema.ts` for Zod validators
- Keep middleware and error handling consistent with the current implementation.
- Prefer using the existing config object in [src/config/env.ts](src/config/env.ts) instead of reading `process.env` directly in new code.

## Runtime Notes

- The API listens on `PORT` (default `3000`).
- Swagger docs are served from `/docs`.
- Prisma models are defined in [prisma/schema.prisma](prisma/schema.prisma).
- The login implementation is currently a demo flow and should be treated as such when modifying auth behavior.

## Verification Commands

Before claiming success, run:

```bash
npm run build
```

If you change database behavior or Prisma models, also verify the migration workflow with:

```bash
npm run prisma:migrate
```

## Documentation Expectations

When updating behavior, keep the docs in [README.md](README.md) aligned with the actual routes, environment variables, and startup steps.

## Safety Notes

- Do not commit secrets or real credentials.
- Do not change the public API shape without updating the route documentation and Swagger comments.
- If a server startup issue occurs, confirm whether the configured port is already in use before assuming the code is broken.
