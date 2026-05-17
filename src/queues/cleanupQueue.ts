import { Queue } from 'bullmq';
import { redisConnection } from '../lib/redis.ts';

export const cleanupQueue = new Queue('cleanup-queue', { connection: redisConnection });
