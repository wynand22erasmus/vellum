/**
 * Direct PostgreSQL executor for embedded Prisma Studio (self-hosted DB).
 *
 * `createPrismaPostgresHttpClient` speaks Prisma Postgres / Accelerate HTTP and fails
 * against a normal `postgresql://` URL with "fetch failed".
 *
 * @packageDocumentation
 */

import type { Pool } from 'pg';
import pg from 'pg';
import { AppError } from './errors/app-error.ts';

type StudioQuery = {
  sql: string;
  parameters: readonly unknown[];
};

type ExecuteOptions = {
  abortSignal?: AbortSignal;
};

type QueryResult = Record<string, unknown>[];

let pool: Pool | undefined;

function getPool(): Pool {
  if (!pool) {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      throw AppError.serviceUnavailable('DATABASE_URL is not configured.');
    }
    pool = new pg.Pool({ connectionString: url });
  }
  return pool;
}

function asRows(result: pg.QueryResult): QueryResult {
  return result.rows as QueryResult;
}

/**
 * Executor compatible with `@prisma/studio-core` BFF responses.
 */
export function createPgStudioExecutor(db: Pool = getPool()) {
  return {
    async execute(
      query: StudioQuery,
      options?: ExecuteOptions,
    ): Promise<[Error] | [null, QueryResult]> {
      const { abortSignal } = options ?? {};

      if (!abortSignal) {
        try {
          const result = await db.query(query.sql, query.parameters as unknown[]);
          return [null, asRows(result)];
        } catch (error) {
          return [error as Error];
        }
      }

      if (abortSignal.aborted) {
        return [abortError()];
      }

      const client = await db.connect();
      let onAbort: (() => void) | undefined;

      try {
        const abortPromise = new Promise<never>((_, reject) => {
          onAbort = () => reject(abortError());
          abortSignal.addEventListener('abort', onAbort);
        });

        const result = await Promise.race([
          client.query(query.sql, query.parameters as unknown[]),
          abortPromise,
        ]);

        return [null, asRows(result)];
      } catch (error) {
        return [error as Error];
      } finally {
        if (onAbort) {
          abortSignal.removeEventListener('abort', onAbort);
        }
        client.release();
      }
    },
  };
}

function abortError(): Error {
  const error = new Error('Aborted');
  error.name = 'AbortError';
  return error;
}
