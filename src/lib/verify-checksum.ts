/**
 * Persists verify success checksum for the recipient complete page.
 *
 * @packageDocumentation
 */

const STORAGE_PREFIX = 'vellum:verify-checksum:';

export type VerifyChecksumPayload = {
  sha256: string;
  fileName?: string;
};

/** Stores checksum data for a verify token until the tab session ends. */
export function storeVerifyChecksum(token: string, payload: VerifyChecksumPayload): void {
  sessionStorage.setItem(`${STORAGE_PREFIX}${token}`, JSON.stringify(payload));
}

/** Reads checksum data saved after a successful verify for this token. */
export function readVerifyChecksum(token: string): VerifyChecksumPayload | null {
  const raw = sessionStorage.getItem(`${STORAGE_PREFIX}${token}`);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as VerifyChecksumPayload;
    if (typeof parsed.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(parsed.sha256)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Helper text for verifying a downloaded file with GNU sha256sum. */
export function sha256sumVerifyHint(fileName: string): string {
  const safeName = fileName.trim() || 'downloaded-file';
  return `After saving, run: sha256sum ${safeName}`;
}
