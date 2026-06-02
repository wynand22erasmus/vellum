/**
 * @packageDocumentation
 */

import { describe, expect, it, vi } from 'vitest';
import { AppError } from '../errors/app-error.ts';
import { CompensationStack } from './compensation-stack.ts';

describe('CompensationStack', () => {
  it('runs undos LIFO when main throws', async () => {
    const order: string[] = [];
    const stack = new CompensationStack();

    await expect(
      stack.run(async () => {
        stack.registerUndo('first', async () => {
          order.push('first');
        });
        stack.registerUndo('second', async () => {
          order.push('second');
        });
        throw AppError.internal('boom');
      }),
    ).rejects.toThrow(AppError);

    expect(order).toEqual(['second', 'first']);
  });

  it('throws partial-failure when undo fails', async () => {
    const stack = new CompensationStack();

    await expect(
      stack.run(async () => {
        stack.registerUndo(
          'fail-undo',
          async () => {
            throw new Error('undo failed');
          },
          () => ({ kind: 's3Object', s3Key: 'documents/abc/file.pdf' }),
        );
        throw AppError.internal('main failed');
      }),
    ).rejects.toMatchObject({
      slug: 'partial-failure',
      extensions: expect.objectContaining({
        orphanedResources: [{ kind: 's3Object', s3Key: 'documents/abc/file.pdf' }],
      }),
    });
  });

  it('returns main result on success', async () => {
    const stack = new CompensationStack();
    const result = await stack.run(async () => {
      stack.registerUndo('noop', vi.fn());
      return 'ok';
    });
    expect(result).toBe('ok');
  });
});
