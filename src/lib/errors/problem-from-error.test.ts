/**
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import { ZodError, z } from 'zod';
import { AppError } from './app-error.ts';
import { problemFromError } from './problem-from-error.ts';
import { problemTypeUri } from './problem-types.ts';

describe('problemFromError', () => {
  it('maps AppError to Problem Details', () => {
    const err = AppError.notFound('Document not found.');
    const { problem } = problemFromError(err, { instance: '/api/documents/1' });
    expect(problem.type).toBe(problemTypeUri('not-found'));
    expect(problem.status).toBe(404);
    expect(problem.detail).toBe('Document not found.');
    expect(problem.instance).toBe('/api/documents/1');
  });

  it('maps ZodError to validation-error', () => {
    const schema = z.object({ email: z.string().email() });
    let zodErr: ZodError | undefined;
    schema.safeParse({ email: 'bad' });
    try {
      schema.parse({ email: 'bad' });
    } catch (e) {
      zodErr = e as ZodError;
    }
    const { problem } = problemFromError(zodErr!);
    expect(problem.type).toBe(problemTypeUri('validation-error'));
    expect(problem.status).toBe(400);
    expect(problem.invalidParams).toBeDefined();
  });

  it('maps unknown errors to internal-error without leaking message', () => {
    const { problem } = problemFromError(new Error('secret db password'));
    const expected = AppError.internal();
    expect(problem.type).toBe(expected.type);
    expect(problem.title).toBe(expected.title);
    expect(problem.status).toBe(expected.status);
    expect(problem.detail).toBe(expected.detail);
    expect(problem.detail).not.toContain('secret');
  });

  it('maps AppError.emailNotVerified to forbidden with reason extension', () => {
    const err = AppError.emailNotVerified();
    const { problem } = problemFromError(err);
    expect(problem.type).toBe(problemTypeUri('forbidden'));
    expect(problem.status).toBe(403);
    expect(problem.reason).toBe('EMAIL_NOT_VERIFIED');
  });
});
