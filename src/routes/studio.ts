/**
 * Embedded Prisma Studio BFF (`POST /api/studio`).
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { serializeError } from '@prisma/studio-core/data/bff';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../lib/errors/app-error.ts';
import { env } from '../lib/env.ts';
import { createPgStudioExecutor } from '../lib/studio-pg-executor.ts';

/** Express router for embedded Prisma Studio BFF (`POST /api/studio`). */
export const studioRouter = Router();

/**
 * Executes Studio SQL against `DATABASE_URL` (dev/admin only).
 */
studioRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    if (env.isProduction) {
      throw AppError.notFound('Not found.');
    }

    const body = req.body as { query?: { sql: string; parameters: unknown[] } };
    const query = body.query;
    if (!query?.sql) {
      res.json([serializeError(new Error('Missing query in request body.'))]);
      return;
    }

    const [error, results] = await createPgStudioExecutor().execute(query);
    if (error) {
      res.json([serializeError(error)]);
      return;
    }
    res.json([null, results]);
  }),
);
