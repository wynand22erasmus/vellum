/**
 * Seeds a document for E2E/API tests via upload + DB token lookup.
 * Falls back to direct MinIO + Postgres insert when upload fails (e.g. ClamAV timeout).
 * Writes e2e/.state.json and bruno/collections/vellum-api/environments/Seeded.bru
 */
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import argon2 from 'argon2';
import pg from 'pg';
import 'dotenv/config';
import { buildPublicUrl } from '../src/lib/public-url.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const baseUrl = process.env.E2E_BASE_URL ?? buildPublicUrl();
const apiKey = process.env.API_KEY ?? 'dev-api-key-change-in-production';
const databaseUrl =
  process.env.DATABASE_URL_HOST ??
  process.env.DATABASE_URL ??
  'postgresql://vellum:password@localhost:5432/vellum_db';
const minioEndpoint = process.env.MINIO_ENDPOINT ?? 'http://localhost:9000';
const minioUser = process.env.MINIO_ROOT_USER ?? 'minioadmin';
const minioPassword = process.env.MINIO_ROOT_PASSWORD ?? 'minioadmin';
const minioBucket = process.env.MINIO_BUCKET_NAME ?? 'vellum-documents';
const reportingYears = Number(process.env.REPORTING_LIFETIME_YEARS ?? 5);

const recipientEmail = process.env.E2E_RECIPIENT_EMAIL ?? `e2e-${Date.now()}@example.com`;
const password = process.env.E2E_FILE_PASSWORD ?? 'e2eSecure1!';

const fixturesDir = path.join(root, 'bruno/collections/vellum-api/fixtures');
const { fileName } = JSON.parse(
  fs.readFileSync(path.join(fixturesDir, 'e2e-upload.fixture.json'), 'utf8'),
);
const uploadFixturePath = path.join(fixturesDir, fileName);
const fileContent = fs.readFileSync(uploadFixturePath);
const linkTtlSeconds = 86_400;
const fileTtlSeconds = 604_800;

function writeArtifacts(documentId, communicationId, downloadToken) {
  const state = {
    baseUrl,
    apiKey,
    documentId,
    communicationId,
    downloadToken,
    recipientEmail,
    password,
    fileName,
    seededAt: new Date().toISOString(),
  };

  const statePath = path.join(root, 'e2e', '.state.json');
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  const seededEnvPath = path.join(
    root,
    'bruno',
    'collections',
    'vellum-api',
    'environments',
    'Seeded.bru',
  );
  fs.mkdirSync(path.dirname(seededEnvPath), { recursive: true });
  fs.writeFileSync(
    seededEnvPath,
    `vars {
  baseUrl: ${baseUrl}
  apiKey: ${apiKey}
  devEmail: ${recipientEmail}
  filePassword: ${password}
  documentId: ${documentId}
  communicationId: ${communicationId}
  downloadToken: ${downloadToken}
  fileName: ${fileName}
}
`,
  );

  console.log('[e2e-seed] OK');
  console.log(`  documentId:      ${documentId}`);
  console.log(`  communicationId: ${communicationId}`);
  console.log(`  downloadToken: ${downloadToken.slice(0, 8)}…`);
  console.log(`  state:         ${statePath}`);
}

async function fetchCommunicationIds(documentId) {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  const { rows } = await client.query(
    `SELECT "communicationId", "downloadToken" FROM "Communication"
     WHERE "documentId" = $1
     ORDER BY "createdAt" DESC
     LIMIT 1`,
    [documentId],
  );
  await client.end();
  return rows[0] ?? null;
}

async function seedViaUpload() {
  const form = new FormData();
  form.append('file', new Blob([fileContent], { type: 'application/pdf' }), fileName);
  form.append('recipientEmail', recipientEmail);
  form.append('password', password);
  form.append('linkTtl', String(linkTtlSeconds));
  form.append('fileTtl', String(fileTtlSeconds));

  const maxAttempts = Number(process.env.E2E_SEED_RETRIES ?? 1);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const uploadRes = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const uploadBody = await uploadRes.json().catch(() => ({}));
    const data = uploadBody.data && typeof uploadBody.data === 'object' ? uploadBody.data : uploadBody;
    const uploadedId =
      (typeof data.documentId === 'string' && data.documentId.length > 0
        ? data.documentId
        : undefined) ??
      (typeof data.id === 'string' && data.id.length > 0 ? data.id : undefined);
    if (uploadRes.ok && typeof uploadedId === 'string' && uploadedId.length > 0) {
      return uploadedId;
    }
    if (uploadRes.status === 503 && attempt < maxAttempts) {
      console.warn(
        `[e2e-seed] Upload attempt ${attempt} failed (scanner busy), retrying in 15s…`,
      );
      await new Promise((r) => setTimeout(r, 15_000));
      continue;
    }
    const contentType = uploadRes.headers.get('content-type') ?? '';
    if (contentType.includes('application/problem+json')) {
      const detail = uploadBody.detail ?? uploadBody.title ?? 'unknown';
      console.warn(`[e2e-seed] Upload failed (${uploadRes.status}): ${detail}`);
    }
    throw new Error(`Upload failed: ${uploadRes.status} ${JSON.stringify(uploadBody)}`);
  }
  throw new Error('Upload failed after retries');
}

async function ensureMinioBucket(s3) {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: minioBucket }));
  } catch {
    await s3.send(new CreateBucketCommand({ Bucket: minioBucket }));
  }
}

async function seedDirect() {
  console.warn('[e2e-seed] Using direct DB + MinIO fallback (upload API unavailable).');

  const communicationId = randomUUID();
  const documentId = randomUUID();
  const fileId = randomUUID();
  const recipientId = randomUUID();
  const downloadToken = randomBytes(32).toString('hex');
  const s3Key = `documents/${randomBytes(16).toString('hex')}/${fileName}`;
  const passwordHash = await argon2.hash(password);
  const sha256 = createHash('sha256').update(fileContent).digest('hex');
  const now = new Date();
  const linkExpiresAt = new Date(now.getTime() + linkTtlSeconds * 1000);
  const fileExpiresAt = new Date(now.getTime() + fileTtlSeconds * 1000);
  const recordExpiresAt = new Date(now);
  recordExpiresAt.setFullYear(recordExpiresAt.getFullYear() + reportingYears);

  const s3 = new S3Client({
    endpoint: minioEndpoint,
    region: process.env.AWS_REGION ?? 'us-east-1',
    credentials: { accessKeyId: minioUser, secretAccessKey: minioPassword },
    forcePathStyle: true,
  });

  await ensureMinioBucket(s3);
  await s3.send(
    new PutObjectCommand({
      Bucket: minioBucket,
      Key: s3Key,
      Body: fileContent,
      ContentType: 'application/pdf',
    }),
  );

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  await client.query(
    `INSERT INTO "File" (
      "fileId", sha256, "s3Key", "fileName", "fileExpiresAt", "recordExpiresAt", "createdAt", "updatedAt", "byteSize"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8)`,
    [fileId, sha256, s3Key, fileName, fileExpiresAt, recordExpiresAt, now, fileContent.length],
  );
  await client.query(
    `INSERT INTO "Recipient" (
      "recipientId", "sourceSystemKey", email, "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3, $4, $4)`,
    [recipientId, recipientEmail, recipientEmail, now],
  );
  await client.query(
    `INSERT INTO "Document" (
      "documentId", "fileId", "recipientId", "passwordHash", "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3, $4, $5, $5)`,
    [documentId, fileId, recipientId, passwordHash, now],
  );
  await client.query(
    `INSERT INTO "Communication" (
      "communicationId", "documentId", "downloadToken", "linkExpiresAt", "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3, $4, $5, $5)`,
    [communicationId, documentId, downloadToken, linkExpiresAt, now],
  );
  await client.end();

  return { documentId, communicationId, downloadToken };
}

console.log(`[e2e-seed] Seeding for ${recipientEmail}…`);

let documentId;
let communicationId;
let downloadToken;

try {
  console.log(`[e2e-seed] Trying upload via ${baseUrl}/api/upload…`);
  documentId = await seedViaUpload();
  const comm = await fetchCommunicationIds(documentId);
  if (!comm?.downloadToken) {
    throw new Error(`No communication for document ${documentId}`);
  }
  communicationId = comm.communicationId;
  downloadToken = comm.downloadToken;
} catch (uploadErr) {
  console.warn(`[e2e-seed] ${uploadErr instanceof Error ? uploadErr.message : uploadErr}`);
  ({ documentId, communicationId, downloadToken } = await seedDirect());
}

writeArtifacts(documentId, communicationId, downloadToken);
