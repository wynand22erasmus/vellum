import { Worker } from 'bullmq';
import type { AuditEventType, Prisma } from '@prisma/client';
import { addYears } from 'date-fns';
import { prisma } from '../lib/prisma.ts';
import { env } from '../lib/env.ts';
import { redisConnection } from '../lib/redis.ts';
import type { LogEventData } from '../queues/auditQueue.ts';

export const auditWorker = new Worker(
  'audit-queue',
  async (job) => {
    const { eventType, documentId, userId, metadata, ip, userAgent } =
      job.data as LogEventData;

    await prisma.auditLog.create({
      data: {
        eventType: eventType as AuditEventType,
        documentId,
        userId,
        metadata: (metadata ?? undefined) as Prisma.InputJsonValue | undefined,
        ipAddress: ip,
        userAgent,
        expiresAt: addYears(new Date(), env.reportingLifetimeYears),
      },
    });
  },
  { connection: redisConnection },
);

auditWorker.on('failed', (job, err) => {
  console.error(`[auditWorker] Job ${job?.id} failed:`, err);
});
