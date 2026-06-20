/**
 * BullMQ queue for outbound audit webhook delivery.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import type { AuditEventType } from '../../../generated/client.ts';
import { env } from '../../lib/env.ts';
import { redisConnection } from '../../lib/redis.ts';
import { webhookUrlForEventType } from '../../lib/webhooks/webhook-url-registry.ts';

/** BullMQ queue name: `webhook-queue`. Processed by `webhookWorker`. */
export const webhookQueue = new Queue('webhook-queue', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: env.webhookMaxRetries,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

/** Payload for a single webhook delivery job (`deliver-webhook`). */
export interface WebhookDeliveryJobData {
  auditLogId: string;
  eventType: AuditEventType;
}

/**
 * Enqueues webhook delivery when webhooks are enabled and a target URL is configured.
 *
 * @param auditLogId - Persisted audit row id
 * @param eventType - Event type that was logged
 */
export function enqueueWebhookDelivery(auditLogId: string, eventType: AuditEventType): void {
  if (!webhookUrlForEventType(eventType)) {
    return;
  }

  void webhookQueue.add('deliver-webhook', {
    auditLogId,
    eventType,
  } satisfies WebhookDeliveryJobData);
}
