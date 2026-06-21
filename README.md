# Eone CRM API

A TypeScript Express backend for storing and serving CRM lead data, handling webhook payloads, and exposing Swagger documentation.

## Overview

This project provides:

- JWT-based auth endpoints for demo login flow
- CRUD-style lead retrieval endpoints
- Webhook ingestion for lead payloads
- Health checks for liveness and readiness
- Supabase integration endpoints for user/admin context
- Swagger UI at `/docs`

## Tech Stack

- Node.js + TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod for request validation
- JWT, bcryptjs, cors, helmet
- Swagger (`swagger-jsdoc` + `swagger-ui-express`)

## Project Structure

- `src/app.ts` — Express app setup, middleware, route registration
- `src/server.ts` — startup entry point
- `src/auth/` — auth routes and service
- `src/leads/` — lead routes, repository, service
- `src/webhooks/` — webhook processing
- `src/supabase/` — Supabase handlers and routes
- `src/middleware/` — auth, API key, request ID, and error middleware
- `src/validators/` — request schemas
- `src/config/` — environment and Prisma configuration
- `prisma/schema.prisma` — Prisma schema and database models

## Environment Variables

Copy `.env.example` to `.env` and update values as needed:

- `PORT` — API port (default: `3000`)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing secret
- `JWT_EXPIRES_IN` — token expiry (default: `15m`)
- `BCRYPT_ROUNDS` — password hashing cost
- `LOG_LEVEL` — log level (default: `info`)
- `WEBHOOK_API_KEY` — API key used for webhook authentication
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `SUPABASE_JWKS_URL` — Supabase configuration values

## Installation

```bash
npm install
cp .env.example .env
npm run prisma:generate
```

## Database Setup

Run Prisma migrations after configuring `DATABASE_URL`:

```bash
npm run prisma:migrate
```

## Running the API

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
npm start
```

## API Endpoints

### Health

- `GET /health/live`
- `GET /health/ready`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Leads

- `GET /api/v1/leads` (requires JWT auth)
- `GET /api/v1/leads/info` (requires JWT auth)
- `GET /api/v1/leads/supabase`

### Webhooks

- `POST /api/v1/webhooks/leads` (requires `x-api-key` header)

### Supabase

- `GET /supabase/user`
- `GET /supabase/admin`

### Documentation

- `GET /docs`

## Notes

- The auth flow now uses real credential checks against the database for local registration/login.
- The login handler also attempts Supabase password auth when the Supabase auth environment is configured.
- The webhook processor stores events and prevents duplicate leads using `platform_lead_id`.
- The server currently reads its config from [src/config/env.ts](src/config/env.ts).

## Verification

The project build has been verified with:

```bash
npm run build
```
