/**
 * BullMQ queue for outbound download-link emails.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import { redisConnection } from '../lib/redis.ts';

/**
 * BullMQ queue name: `email-queue`.
 * Jobs: `send-initial` / regenerate payloads processed by {@link ../workers/emailWorker.ts}.
 */
export const emailQueue = new Queue('email-queue', { connection: redisConnection });
