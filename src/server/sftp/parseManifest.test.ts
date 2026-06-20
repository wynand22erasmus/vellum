/**
 * Unit tests for SFTP manifest parsing.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import { manifestPathForFile, parseManifestJson } from './parseManifest.ts';

describe('parseManifestJson', () => {
  it('parses a valid manifest', () => {
    const manifest = parseManifestJson(
      JSON.stringify({
        recipientEmail: 'partner@example.com',
        password: 'secret-pass',
        linkTtl: 86400,
        fileTtl: 604800,
      }),
    );

    expect(manifest).toEqual({
      recipientEmail: 'partner@example.com',
      password: 'secret-pass',
      linkTtl: 86400,
      fileTtl: 604800,
    });
  });

  it('rejects invalid email', () => {
    expect(() =>
      parseManifestJson(
        JSON.stringify({
          recipientEmail: 'not-an-email',
          password: 'secret-pass',
          linkTtl: 86400,
          fileTtl: 604800,
        }),
      ),
    ).toThrow();
  });

  it('rejects short password', () => {
    expect(() =>
      parseManifestJson(
        JSON.stringify({
          recipientEmail: 'partner@example.com',
          password: 'short',
          linkTtl: 86400,
          fileTtl: 604800,
        }),
      ),
    ).toThrow();
  });

  it('rejects linkTtl greater than fileTtl', () => {
    expect(() =>
      parseManifestJson(
        JSON.stringify({
          recipientEmail: 'partner@example.com',
          password: 'secret-pass',
          linkTtl: 999999,
          fileTtl: 3600,
        }),
      ),
    ).toThrow();
  });
});

describe('manifestPathForFile', () => {
  it('appends the manifest suffix to the data file path', () => {
    expect(manifestPathForFile('/inbox/report.pdf', '.json')).toBe('/inbox/report.pdf.json');
  });
});
