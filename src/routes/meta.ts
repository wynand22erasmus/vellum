/**
 * Public metadata for the SPA (dev service links, environment flags).
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { getDevServices } from '../lib/dev-services.ts';
import { env } from '../lib/env.ts';

/** Express router mounted at `/api`. */
export const metaRouter = Router();

/**
 * `GET /api/meta` — environment flags and dev service URLs for the UI menu.
 */
metaRouter.get('/meta', (_req, res) => {
  res.json({
    isProduction: env.isProduction,
    devServices: getDevServices(),
  });
});
