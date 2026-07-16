/**
 * Dead-letter row creation for failed queue writes.
 *
 * @packageDocumentation
 */

import type { Prisma } from '../../generated/client.ts';
import type { DeadLetterPipeline } from '../../generated/enums.ts';
import { prisma } from './prisma.ts';

/** Input for {@link createDeadLetter}. */
export type CreateDeadLetterInput = {
  pipeline: DeadLetterPipeline;
  payload: object;
  error: string;
};

/** Persists a dead-letter row when a queue job cannot be processed. */
export async function createDeadLetter(input: CreateDeadLetterInput) {
  return prisma.deadLetter.create({
    data: {
      pipeline: input.pipeline,
      payload: input.payload as Prisma.InputJsonValue,
      error: input.error,
    },
  });
}
