/**
 * Tests for SHA-256 deduplication in {@link ingestFile}.
 *
 * @packageDocumentation
 */

import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CompensationStack } from '../compensation/compensation-stack.ts';
import { computeSha256, ingestFile } from './ingestFile.ts';

const mockFindUnique = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockScanBuffer = vi.fn();
const mockUploadObject = vi.fn();

vi.mock('../prisma.ts', () => ({
  prisma: {
    file: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      create: (...args: unknown[]) => mockCreate(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
    },
  },
}));

vi.mock('../clamav.ts', () => ({
  scanBuffer: (...args: unknown[]) => mockScanBuffer(...args),
}));

vi.mock('../storage/s3Client.ts', () => ({
  uploadObject: (...args: unknown[]) => mockUploadObject(...args),
}));

vi.mock('../env.ts', () => ({
  env: {
    skipVirusScan: true,
    reportingLifetimeYears: 5,
  },
}));

describe('computeSha256', () => {
  it('returns a 64-char hex digest', () => {
    const digest = computeSha256(Buffer.from('hello'));
    expect(digest).toMatch(/^[a-f0-9]{64}$/);
    expect(digest).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});

describe('ingestFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reuses an existing file with matching sha256 and skips scan/upload', async () => {
    const buffer = Buffer.from('duplicate-content');
    const sha256 = computeSha256(buffer);
    const existing = {
      id: 'file-1',
      sha256,
      s3Key: 'documents/abc/report.pdf',
      fileName: 'report.pdf',
      fileExpiresAt: new Date('2030-01-01'),
      recordExpiresAt: new Date('2035-01-01'),
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      byteSize: buffer.length,
    };
    mockFindUnique.mockResolvedValue(existing);

    const stack = new CompensationStack();
    const result = await ingestFile({
      buffer,
      fileName: 'report.pdf',
      mimeType: 'application/pdf',
      fileTtlSeconds: 3600,
      stack,
    });

    expect(result).toBe(existing);
    expect(mockScanBuffer).not.toHaveBeenCalled();
    expect(mockUploadObject).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('extends fileExpiresAt when a longer TTL is requested', async () => {
    const buffer = Buffer.from('duplicate-content');
    const sha256 = computeSha256(buffer);
    const existing = {
      id: 'file-1',
      sha256,
      s3Key: 'documents/abc/report.pdf',
      fileName: 'report.pdf',
      fileExpiresAt: new Date('2026-01-01'),
      recordExpiresAt: new Date('2035-01-01'),
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      byteSize: buffer.length,
    };
    const extended = {
      ...existing,
      fileExpiresAt: new Date('2030-06-01'),
    };
    mockFindUnique.mockResolvedValue(existing);
    mockUpdate.mockResolvedValue(extended);

    const stack = new CompensationStack();
    const result = await ingestFile({
      buffer,
      fileName: 'report.pdf',
      mimeType: 'application/pdf',
      fileTtlSeconds: 999_999_999,
      stack,
    });

    expect(mockUpdate).toHaveBeenCalledOnce();
    expect(result.fileExpiresAt).toEqual(extended.fileExpiresAt);
    expect(mockScanBuffer).not.toHaveBeenCalled();
    expect(mockUploadObject).not.toHaveBeenCalled();
  });
});
