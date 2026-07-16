/**
 * BullMQ queue for scheduled file and record purging.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import { redisConnection } from '../../lib/redis.ts';

/**
 * BullMQ queue name: `cleanup-queue`.
 * Scheduled jobs: `purge-files` (hourly), `purge-records` (monthly).
 */
export const cleanupQueue = new Queue('cleanup-queue', { connection: redisConnection });
