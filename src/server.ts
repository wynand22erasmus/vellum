import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './lib/env.ts';
import { apiKeyAuth } from './middleware/apiKeyAuth.ts';
import { dashboardAuth } from './middleware/devAuth.ts';
import { requestId } from './middleware/requestId.ts';
import { ensureBucket } from './lib/storage/s3Client.ts';
import { healthRouter } from './routes/health.ts';
import { uploadRouter } from './routes/upload.ts';
import { verifyRouter } from './routes/verify.ts';
import { documentsRouter } from './routes/documents.ts';
import { authRouter } from './routes/auth.ts';

const app = express();

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(requestId);

app.use('/api', healthRouter);
app.use('/api/upload', apiKeyAuth, uploadRouter);
app.use('/api/verify', verifyRouter);
app.use('/api/documents', dashboardAuth, documentsRouter);
app.use('/api/auth', authRouter);

if (env.isProduction) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

void ensureBucket().catch((err) => {
  console.warn('[Storage] Bucket bootstrap failed (will retry on upload):', err);
});

export const viteNodeApp = app;
