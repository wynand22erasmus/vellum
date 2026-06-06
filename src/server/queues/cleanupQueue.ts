/**
 * BullMQ queue for scheduled file and record scrubbing.
 *
 * @packageDocumentation
 */

import { Queue } from 'bullmq';
import { redisConnection } from '../../lib/redis.ts';

/**
 * BullMQ queue name: `cleanup-queue`.
 * Scheduled jobs: `scrub-files` (hourly), `scrub-records` (monthly).
 */
export const cleanupQueue = new Queue('cleanup-queue', { connection: redisConnection });
