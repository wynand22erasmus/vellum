/**
 * S3-compatible object storage (MinIO in dev, AWS S3 in production).
 *
 * @packageDocumentation
 */

import {
  CreateBucketCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../env.ts';

/** Shared S3 client (path-style, configured for MinIO or AWS). */
export const s3Client = new S3Client({
  endpoint: env.minioEndpoint,
  region: env.awsRegion,
  credentials: {
    accessKeyId: env.minioRootUser,
    secretAccessKey: env.minioRootPassword,
  },
  forcePathStyle: true,
});

/**
 * Ensures the configured bucket exists, creating it when missing.
 *
 * @remarks Safe to call at startup; upload path retries on failure.
 */
export async function ensureBucket(): Promise<void> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: env.minioBucket }));
  } catch {
    await s3Client.send(new CreateBucketCommand({ Bucket: env.minioBucket }));
  }
}

/**
 * Uploads a buffer to the documents bucket.
 *
 * @param key - Object key (typically document id)
 * @param body - File bytes
 * @param contentType - MIME type for `Content-Type`
 */
export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string,
): Promise<void> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.minioBucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

/**
 * Deletes an object from the documents bucket (scrub worker).
 *
 * @param key - Object key to remove
 */
export async function deleteObject(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.minioBucket,
      Key: key,
    }),
  );
}

/**
 * Returns a short-lived presigned GET URL for recipient download.
 *
 * @param s3Key - Stored object key
 * @param fileName - Filename sent in `Content-Disposition`
 * @returns URL valid for 30 seconds
 */
export async function generatePresignedUrl(
  s3Key: string,
  fileName: string,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: env.minioBucket,
    Key: s3Key,
    ResponseContentDisposition: `attachment; filename="${fileName.replace(/"/g, '')}"`,
  });
  return getSignedUrl(s3Client, command, { expiresIn: 30 });
}
