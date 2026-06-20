import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  readVerifyChecksum,
  sha256sumVerifyHint,
  storeVerifyChecksum,
} from './verify-checksum.ts';

describe('verify-checksum', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    });
  });

  afterEach(() => {
    storage.clear();
    vi.unstubAllGlobals();
  });

  it('stores and reads checksum payload for a token', () => {
    const sha256 = 'b'.repeat(64);
    storeVerifyChecksum('token-1', { sha256, fileName: 'report.pdf' });

    expect(readVerifyChecksum('token-1')).toEqual({ sha256, fileName: 'report.pdf' });
    expect(readVerifyChecksum('other-token')).toBeNull();
  });

  it('rejects invalid stored checksum payloads', () => {
    storage.set('vellum:verify-checksum:bad', JSON.stringify({ sha256: 'not-a-digest' }));
    expect(readVerifyChecksum('bad')).toBeNull();
  });

  it('builds sha256sum helper text with the file name', () => {
    expect(sha256sumVerifyHint('report.pdf')).toBe('After saving, run: sha256sum report.pdf');
    expect(sha256sumVerifyHint('  ')).toBe('After saving, run: sha256sum downloaded-file');
  });
});
