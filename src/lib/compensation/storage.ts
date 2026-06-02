/**
 * S3 compensation helpers.
 *
 * @packageDocumentation
 */

import { deleteObject } from '../storage/s3Client.ts';

/**
 * Deletes an S3 object if present (idempotent — ignores not-found).
 *
 * @param s3Key - Object key to remove
 */
export async function deleteObjectIfExists(s3Key: string): Promise<void> {
  try {
    await deleteObject(s3Key);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/not found|nosuchkey|404/i.test(message)) {
      return;
    }
    throw err;
  }
}
