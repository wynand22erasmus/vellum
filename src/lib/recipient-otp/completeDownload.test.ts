import { afterEach, describe, expect, it, vi } from 'vitest';
import type { CommunicationContext } from '../documents/types.ts';
import { completeDownload } from './completeDownload.ts';

vi.mock('../prisma.ts', () => ({
  prisma: {
    document: {
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('../storage/s3Client.ts', () => ({
  generatePresignedUrl: vi.fn().mockResolvedValue('https://example.test/file'),
}));

vi.mock('../../server/queues/auditQueue.ts', () => ({
  logEvent: vi.fn(),
}));

vi.mock('../env.ts', () => ({
  env: {
    reverifyWindowMs: 900_000,
    maxReverifyAttempts: 3,
  },
}));

const { logEvent } = await import('../../server/queues/auditQueue.ts');

function sampleDoc(overrides: Partial<CommunicationContext> = {}): CommunicationContext {
  return {
    communicationId: 'link-1',
    documentId: 'doc-1',
    fileId: 'file-1',
    recipientId: 'recipient-1',
    batchId: null,
    email: 'recipient@example.com',
    sourceSystemKey: 'recipient@example.com',
    phoneNumber: null,
    downloadToken: 'token',
    passwordHash: 'hash',
    linkExpiresAt: new Date('2030-01-01T00:00:00.000Z'),
    maxDownloads: 2,
    downloadCount: 0,
    verifySuccessCount: 0,
    lastVerifiedAt: null,
    revokedAt: null,
    otpChannel: null,
    authenticatorSecretEnc: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    s3Key: 'documents/key.pdf',
    fileName: 'report.pdf',
    fileExpiresAt: new Date('2030-01-01T00:00:00.000Z'),
    recordExpiresAt: new Date('2030-01-01T00:00:00.000Z'),
    deletedAt: null,
    sha256: 'a'.repeat(64),
    ...overrides,
  };
}

describe('completeDownload', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns sha256 and includes it in FILE_DOWNLOAD_SUCCESS metadata', async () => {
    const doc = sampleDoc();
    const now = new Date('2026-06-01T12:00:00.000Z');

    const result = await completeDownload(doc, { ip: '127.0.0.1', headers: {} }, now);

    expect(result.sha256).toBe(doc.sha256);
    expect(result.downloadUrl).toBe('https://example.test/file');
    expect(vi.mocked(logEvent)).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'FILE_DOWNLOAD_SUCCESS',
        documentId: doc.documentId,
        communicationId: doc.communicationId,
        metadata: expect.objectContaining({ sha256: doc.sha256 }),
      }),
    );
  });
});
