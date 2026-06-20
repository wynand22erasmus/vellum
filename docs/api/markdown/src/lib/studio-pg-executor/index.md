# src/lib/studio-pg-executor

Direct PostgreSQL executor for embedded Prisma Studio (self-hosted DB).

`createPrismaPostgresHttpClient` speaks Prisma Postgres / Accelerate HTTP and fails
against a normal `postgresql://` URL with "fetch failed".

## Functions

- [createPgStudioExecutor](functions/createPgStudioExecutor.md)
