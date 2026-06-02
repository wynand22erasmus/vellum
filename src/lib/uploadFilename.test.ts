/**
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import {
  basenameSafe,
  effectiveExtensionFromBasename,
  resolveUploadFileName,
  stripDangerousTrailingExtensions,
} from './uploadFilename.ts';
import { AppError } from './errors/app-error.ts';

describe('basenameSafe', () => {
  it('rejects path traversal', () => {
    expect(basenameSafe('../../../etc/passwd')).toBeNull();
    expect(basenameSafe('foo/../bar.txt')).toBeNull();
  });

  it('rejects absolute paths', () => {
    expect(basenameSafe('/etc/passwd')).toBeNull();
    expect(basenameSafe('C:/Windows/evil.txt')).toBeNull();
  });

  it('returns basename for relative names', () => {
    expect(basenameSafe('subdir\\file.pdf')).toBe('file.pdf');
    expect(basenameSafe('  report.docx  ')).toBe('report.docx');
  });
});

describe('stripDangerousTrailingExtensions', () => {
  it('strips spoofed executable suffix', () => {
    expect(stripDangerousTrailingExtensions('report.pdf.exe')).toBe('report.pdf');
    expect(stripDangerousTrailingExtensions('report.PDF.EXE')).toBe('report.PDF');
  });

  it('strips multiple dangerous suffixes', () => {
    expect(stripDangerousTrailingExtensions('x.pdf.exe.bat')).toBe('x.pdf');
  });

  it('does not strip non-dangerous extensions', () => {
    expect(stripDangerousTrailingExtensions('notes.txt')).toBe('notes.txt');
    expect(stripDangerousTrailingExtensions('a.b.pdf')).toBe('a.b.pdf');
  });
});

describe('effectiveExtensionFromBasename', () => {
  it('returns last extension lowercase', () => {
    expect(effectiveExtensionFromBasename('a.b.PDF')).toBe('pdf');
    expect(effectiveExtensionFromBasename('noext')).toBeNull();
  });
});

describe('resolveUploadFileName', () => {
  it('accepts allowed type after stripping trick extension', () => {
    const r = resolveUploadFileName('report.pdf.exe', ['pdf']);
    expect(r).toEqual({ safeFileName: 'report.pdf', effectiveExtension: 'pdf' });
  });

  it('rejects when effective type not allowed', () => {
    expect(() => resolveUploadFileName('data.bin', ['pdf', 'txt'])).toThrow(AppError);
    try {
      resolveUploadFileName('data.bin', ['pdf', 'txt']);
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).detail).toMatch(/not allowed/i);
    }
  });

  it('allows any extension when * is configured', () => {
    const r = resolveUploadFileName('weird.xyz', ['*']);
    expect(r).toEqual({ safeFileName: 'weird.xyz', effectiveExtension: 'xyz' });
  });

  it('still strips dangerous trailing ext when * is configured', () => {
    const r = resolveUploadFileName('report.pdf.exe', ['*']);
    expect(r).toEqual({ safeFileName: 'report.pdf', effectiveExtension: 'pdf' });
  });
});
