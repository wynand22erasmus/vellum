/**
 * @packageDocumentation
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const addMock = vi.fn().mockResolvedValue(undefined);
const appendMock = vi.fn();
const createDeadLetterMock = vi.fn();

vi.mock('../../server/queues/processErrorQueue.ts', () => ({
  processErrorQueue: { add: addMock },
}));

vi.mock('./process-error-logger.ts', () => ({
  appendProcessErrorLog: appendMock,
}));

vi.mock('../dead-letter.ts', () => ({
  createDeadLetter: createDeadLetterMock,
}));

const { recordProcessError } = await import('./record-process-error.ts');

describe('recordProcessError', () => {
  beforeEach(() => {
    addMock.mockClear();
    appendMock.mockClear();
    createDeadLetterMock.mockClear();
  });

  it('passes audit link fields through to the queue job', () => {
    recordProcessError({
      problemType: 'https://vellum.dev/problems/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Invalid file password.',
      source: 'http',
      documentId: 'doc-1',
      correlationId: 'corr-abc',
      deadLetterId: 'dl-1',
      auditLogId: 'al-1',
    });

    expect(addMock).toHaveBeenCalledWith('persist-process-error', {
      problemType: 'https://vellum.dev/problems/unauthorized',
      title: 'Unauthorized',
      status: 401,
      detail: 'Invalid file password.',
      source: 'http',
      userId: undefined,
      documentId: 'doc-1',
      extensions: undefined,
      internal: {},
      correlationId: 'corr-abc',
      deadLetterId: 'dl-1',
      auditLogId: 'al-1',
    });
  });

  it('maps relatedDeadLetterId to deadLetterId', () => {
    recordProcessError({
      problemType: 'https://vellum.dev/problems/internal-error',
      title: 'Internal Server Error',
      status: 500,
      detail: 'Queue failed',
      source: 'queue',
      relatedDeadLetterId: 'dl-2',
    });

    expect(addMock).toHaveBeenCalledWith(
      'persist-process-error',
      expect.objectContaining({ deadLetterId: 'dl-2' }),
    );
  });
});
