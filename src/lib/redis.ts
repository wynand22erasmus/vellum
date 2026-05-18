/**
 * Redis connection used by BullMQ queues and health checks.
 *
 * @packageDocumentation
 */

import { Redis } from 'ioredis';
import { env } from './env.ts';

/** Shared ioredis connection (`maxRetriesPerRequest: null` required by BullMQ). */
export const redisConnection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

/**
 * Returns whether Redis responds to `PING`.
 */
export async function checkRedis(): Promise<boolean> {
  try {
    const pong = await redisConnection.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}
