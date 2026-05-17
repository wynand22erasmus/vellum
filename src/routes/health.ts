import { Router } from 'express';
import { checkClamAV } from '../lib/clamav.ts';
import { prisma } from '../lib/prisma.ts';
import { checkRedis } from '../lib/redis.ts';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res) => {
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
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    checks,
  });
});
