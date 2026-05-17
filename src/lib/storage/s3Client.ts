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

export const s3Client = new S3Client({
  endpoint: env.minioEndpoint,
  region: env.awsRegion,
  credentials: {
    accessKeyId: env.minioRootUser,
    secretAccessKey: env.minioRootPassword,
  },
  forcePathStyle: true,
});

export async function ensureBucket(): Promise<void> {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: env.minioBucket }));
  } catch {
    await s3Client.send(new CreateBucketCommand({ Bucket: env.minioBucket }));
  }
}

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

export async function deleteObject(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.minioBucket,
      Key: key,
    }),
  );
}

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
