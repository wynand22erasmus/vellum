/**
 * Health check routes for load balancers and monitoring.
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../lib/errors/app-error.ts';
import { checkClamAV } from '../lib/clamav.ts';
import { prisma } from '../lib/prisma.ts';
import { checkRedis } from '../lib/redis.ts';

/** Express router mounted at `/api`. */
export const healthRouter = Router();

healthRouter.get(
  '/health',
  asyncHandler(async (_req, res) => {
    const checks: Record<string, boolean> = {
      database: false,
      redis: false,
      clamav: false,
    };

    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch {
      checks.database = false;
    }

    checks.redis = await checkRedis();
    checks.clamav = await checkClamAV();

    const healthy = Object.values(checks).every(Boolean);
    if (healthy) {
      res.json({ status: 'ok', checks });
      return;
    }

    throw AppError.serviceUnavailable('One or more dependencies are unavailable.', { checks });
  }),
);
