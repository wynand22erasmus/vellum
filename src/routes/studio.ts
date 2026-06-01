/**
 * Embedded Prisma Studio BFF (`POST /api/studio`).
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { serializeError } from '@prisma/studio-core/data/bff';
import { env } from '../lib/env.ts';
import { createPgStudioExecutor } from '../lib/studio-pg-executor.ts';

/** Express router for embedded Prisma Studio BFF (`POST /api/studio`). */
export const studioRouter = Router();

/**
 * Executes Studio SQL against `DATABASE_URL` (dev/admin only).
 */
studioRouter.post('/', async (req, res) => {
  if (env.isProduction) {
    res.status(404).json({ error: 'Not found.' });
    return;
  }

  try {
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
  } catch (err) {
    res.json([serializeError(err)]);
  }
});
