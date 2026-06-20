/**
 * Document link revocation routes.
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { revokeDocument } from '../../lib/revoke-document.ts';
import { okMessage } from './http-helpers.ts';

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0]! : value;
}

/** Express router for `POST /api/documents/:id/revoke`. */
export const documentRevokeRouter = Router({ mergeParams: true });

documentRevokeRouter.post(
  '/:id/revoke',
  asyncHandler(async (req, res) => {
    const authMode = req.authMode;
    if (authMode !== 'apiKey' && authMode !== 'admin') {
      throw AppError.unauthorized('Revocation requires an admin session or API key.');
    }

    const documentId = routeParam(req.params.id);
    const revokedBy =
      authMode === 'admin' ? req.user!.id : 'api-key';

    await revokeDocument({
      documentId,
      revokedBy,
      authMode,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    okMessage(req, res, 'Download link revoked.');
  }),
);
