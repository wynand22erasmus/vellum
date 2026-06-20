/**
 * Express application factory: API routes, middleware, and production SPA fallback.
 *
 * @packageDocumentation
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '../lib/env.ts';
import { recordProcessError } from '../lib/errors/record-process-error.ts';
import { apiKeyAuth } from './middleware/apiKeyAuth.ts';
import { adminAuth } from './middleware/adminAuth.ts';
import { dashboardAuth } from './middleware/devAuth.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { notFoundHandler } from './middleware/notFoundHandler.ts';
import { requestId } from './middleware/requestId.ts';
import { ensureBucket } from '../lib/storage/s3Client.ts';
import { healthRouter } from './routes/health.ts';
import { metaRouter } from './routes/meta.ts';
import { uploadRouter } from './routes/upload.ts';
import { verifyRouter } from './routes/verify.ts';
import { documentsRouter } from './routes/documents.ts';
import { authRouter } from './routes/auth.ts';
import { adminRouter } from './routes/admin.ts';
import { mountApiDocs } from './routes/docs.ts';
import { documentRevokeRouter } from './routes/document-revoke.ts';
import { integratorOrAdminAuth } from './middleware/integratorOrAdminAuth.ts';
import { studioRouter } from './routes/studio.ts';
import { devRouter } from './routes/dev.ts';

/**
 * Builds the Express app with security middleware and mounted API routers.
 *
 * @returns Configured Express application (SPA in production)
 */
export async function createApp(): Promise<express.Application> {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: true, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.use(requestId);

  app.use('/api', healthRouter);
  app.use('/api', metaRouter);
  app.use('/api/upload', apiKeyAuth, uploadRouter);
  app.use('/api/verify', verifyRouter);
  app.use('/api/documents', integratorOrAdminAuth, documentRevokeRouter);
  app.use('/api/documents', dashboardAuth, documentsRouter);
  app.use('/api/admin', adminAuth, adminRouter);
  app.use('/api/studio', adminAuth, studioRouter);
  app.use('/api/dev', adminAuth, devRouter);
  app.use('/api/auth', authRouter);
  mountApiDocs(app);

  if (env.isProduction) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const dist = path.join(__dirname, '..', '..', 'dist');

    app.use(express.static(dist));
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(path.join(dist, 'index.html'));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  void ensureBucket().catch((err) => {
    recordProcessError({
      problemType: 'https://vellum.dev/problems/service-unavailable',
      title: 'Service Unavailable',
      status: 503,
      detail: 'Storage bucket bootstrap failed.',
      source: 'bootstrap',
      internal: {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      },
    });
  });

  return app;
}
