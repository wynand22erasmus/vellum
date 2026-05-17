import { Queue } from 'bullmq';
import type { AuditEventType } from '../../generated/client.ts';
import { prisma } from '../lib/prisma.ts';
import { redisConnection } from '../lib/redis.ts';
export const auditQueue = new Queue('audit-queue', { connection: redisConnection });

export interface LogEventData {
  eventType: AuditEventType;
  documentId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export function logEvent(data: LogEventData): void {
  auditQueue.add('log-event', data).catch(async (err) => {
    console.error('[AuditQueue] Failed to enqueue audit event:', err);
    try {
      await prisma.failedAuditLog.create({
        data: {
          payload: data as object,
          error: err instanceof Error ? err.message : String(err),
        },
      });
    } catch (fallbackErr) {
      console.error('[AuditQueue] Failed to write FailedAuditLog:', fallbackErr);
    }
  });
}
