/**
 * Prisma client singleton for PostgreSQL via the `pg` driver adapter.
 *
 * @packageDocumentation
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/client.ts';
import pg from 'pg';
import { env } from './env.ts';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * @internal
 * Creates a Prisma client backed by a `pg` connection pool.
 */
function createPrismaClient(): PrismaClient {
  const pool = new pg.Pool({ connectionString: env.databaseUrl() });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

/** Shared Prisma client; reused in development to survive hot reloads. */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
