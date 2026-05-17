import { Redis } from 'ioredis';
import { env } from './env.ts';

export const redisConnection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
});

export async function checkRedis(): Promise<boolean> {
  try {
    const pong = await redisConnection.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}
