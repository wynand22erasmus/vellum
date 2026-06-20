/**
 * SFTP sidecar manifest parsing and validation.
 *
 * @packageDocumentation
 */

import { z } from 'zod';

/** Fields required in `{filename}.json` beside an SFTP data file. */
export const sftpManifestSchema = z
  .object({
    recipientEmail: z.string().email(),
    password: z.string().min(8),
    linkTtl: z.coerce.number().int().positive(),
    fileTtl: z.coerce.number().int().positive(),
  })
  .refine((data) => data.linkTtl <= data.fileTtl, {
    message: 'linkTtl cannot exceed fileTtl',
  });

export type SftpManifest = z.infer<typeof sftpManifestSchema>;

/**
 * Parses and validates a JSON manifest buffer.
 *
 * @throws {z.ZodError} When fields are missing or invalid
 */
export function parseManifestJson(raw: Buffer | string): SftpManifest {
  const text = typeof raw === 'string' ? raw : raw.toString('utf8');
  const parsed: unknown = JSON.parse(text);
  return sftpManifestSchema.parse(parsed);
}

/**
 * Resolves the manifest path for a data file in the SFTP inbox.
 */
export function manifestPathForFile(filePath: string, manifestSuffix: string): string {
  return `${filePath}${manifestSuffix}`;
}
