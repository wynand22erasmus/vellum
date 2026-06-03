/**
 * Upload filename sanitization and allowed-extension checks.
 *
 * @packageDocumentation
 * @remarks
 * Strips trailing “decoy” executable extensions (e.g. `report.pdf.exe` → `report.pdf`)
 * before validating the effective extension against {@link DEFAULT_ALLOWED_UPLOAD_EXTENSIONS}
 * or `ALLOWED_UPLOAD_EXTENSIONS`. Use `["*"]` in env to disable the allowlist only.
 */

import path from 'node:path';
import { AppError } from './errors/app-error.ts';

/**
 * Default allowed extensions when `ALLOWED_UPLOAD_EXTENSIONS` is unset (common document
 * transfer types, including `.pdf` for API/E2E fixtures).
 */
export const DEFAULT_ALLOWED_UPLOAD_EXTENSIONS = [
  'pdf',
  'txt',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'rtf',
  'csv',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'zip',
  'gz',
  '7z',
  'md',
  'json',
  'odt',
  'ods',
] as const;

/** Extensions commonly appended to spoof document types (stripped from the right). */
const DANGEROUS_TRAILING_EXTENSIONS = new Set([
  'exe',
  'scr',
  'bat',
  'cmd',
  'com',
  'pif',
  'vbs',
  'vbe',
  'js',
  'jse',
  'wsf',
  'wsh',
  'msi',
  'dll',
  'cpl',
  'msc',
  'lnk',
  'scf',
  'inf',
  'reg',
  'ps1',
  'psm1',
  'psd1',
  'ps1xml',
  'appx',
  'msix',
  'msp',
  'hta',
  'application',
  'app',
  'deb',
  'rpm',
  'dmg',
  'pkg',
]);

function normalizeExtensionList(entries: readonly string[]): string[] {
  const out: string[] = [];
  for (const e of entries) {
    const n = e.trim().toLowerCase().replace(/^\./u, '');
    if (n.length > 0) {
      out.push(n);
    }
  }
  return out;
}

/**
 * Parses `ALLOWED_UPLOAD_EXTENSIONS` JSON array. Unset/invalid/empty-after-normalize → defaults.
 * Include `"*"` as an entry to allow any extension (sanitization still runs).
 */
export function parseAllowedUploadExtensionsFromEnv(raw: string | undefined): string[] {
  if (!raw?.trim()) {
    return [...DEFAULT_ALLOWED_UPLOAD_EXTENSIONS];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every((x) => typeof x === 'string')) {
      console.warn('[env] ALLOWED_UPLOAD_EXTENSIONS must be a JSON array of strings; using defaults.');
      return [...DEFAULT_ALLOWED_UPLOAD_EXTENSIONS];
    }
    const norms = normalizeExtensionList(parsed);
    if (norms.length === 0) {
      console.warn('[env] ALLOWED_UPLOAD_EXTENSIONS is empty; using defaults.');
      return [...DEFAULT_ALLOWED_UPLOAD_EXTENSIONS];
    }
    return norms;
  } catch {
    console.warn('[env] ALLOWED_UPLOAD_EXTENSIONS is not valid JSON; using defaults.');
    return [...DEFAULT_ALLOWED_UPLOAD_EXTENSIONS];
  }
}

/** @internal */
export function basenameSafe(originalName: string): string | null {
  const trimmed = originalName.trim();
  if (!trimmed || trimmed.includes('\0')) {
    return null;
  }
  const posix = trimmed.replace(/\\/gu, '/');
  if (posix.startsWith('/') || /^[a-zA-Z]:\//u.test(posix)) {
    return null;
  }
  if (/(?:^|\/)\.\.(?:\/|$)/u.test(posix)) {
    return null;
  }
  const base = path.posix.basename(posix);
  if (!base || base === '.' || base === '..') {
    return null;
  }
  return base;
}

/**
 * Removes trailing segments that are dangerous executable types (e.g. `.pdf.exe` → `.pdf`).
 */
export function stripDangerousTrailingExtensions(basename: string): string {
  let name = basename;
  while (name.length > 0) {
    const m = name.match(/\.([^.]+)$/u);
    if (!m?.[1]) {
      break;
    }
    const ext = m[1].toLowerCase();
    if (!DANGEROUS_TRAILING_EXTENSIONS.has(ext)) {
      break;
    }
    name = name.slice(0, -m[0].length);
  }
  return name;
}

/** Returns the last non-empty extension segment, lowercase without dot, or null. */
export function effectiveExtensionFromBasename(basename: string): string | null {
  const m = basename.match(/\.([^.]+)$/u);
  if (!m?.[1]) {
    return null;
  }
  const ext = m[1].toLowerCase();
  return ext.length > 0 ? ext : null;
}

/**
 * Produces a storage-safe filename and validates the effective extension.
 *
 * @param originalName - Multipart `originalname`
 * @param allowedExtensions - Lowercase extensions without leading dots; may include `*` to allow all
 * @throws {@link AppError} When the filename is invalid or the extension is disallowed
 */
export function resolveUploadFileName(
  originalName: string,
  allowedExtensions: readonly string[],
): { safeFileName: string; effectiveExtension: string } {
  const base = basenameSafe(originalName);
  if (!base) {
    throw AppError.uploadRejected(
      `Filename "${originalName}" is empty or contains only path separators after sanitization.`,
    );
  }

  const stripped = stripDangerousTrailingExtensions(base);
  if (!stripped || stripped === '.' || stripped === '..') {
    throw AppError.uploadRejected(
      `Filename "${originalName}" is invalid after removing misleading trailing extensions.`,
    );
  }

  const effectiveExtension = effectiveExtensionFromBasename(stripped);
  if (!effectiveExtension) {
    throw AppError.uploadRejected('Filename must include a file extension (e.g. .pdf).');
  }

  const allowAny = allowedExtensions.includes('*');
  if (!allowAny) {
    const allowed = new Set(allowedExtensions);
    if (!allowed.has(effectiveExtension)) {
      throw AppError.uploadRejected(
        `File type ".${effectiveExtension}" is not allowed. Allowed: ${[...allowed].sort().join(', ')}.`,
      );
    }
  }

  return { safeFileName: stripped, effectiveExtension };
}
