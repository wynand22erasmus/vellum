/**
 * Serves generated TypeDoc HTML at `/docs/` (admin only).
 *
 * @packageDocumentation
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Express, Request, Response } from 'express';
import express from 'express';
import { adminAuth } from '../middleware/adminAuth.ts';

const repoRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const docsRoot = path.join(repoRoot, 'docs', 'api', 'html');

/**
 * Mounts admin-protected API documentation under `/docs`.
 */
export function mountApiDocs(app: Express): void {
  app.use('/docs', adminAuth, (req: Request, res: Response, next) => {
    if (!fs.existsSync(docsRoot)) {
      res
        .status(503)
        .type('text/plain')
        .send('API documentation has not been generated. Run: npm run docs:api');
      return;
    }
    express.static(docsRoot, { index: 'index.html' })(req, res, next);
  });
}
