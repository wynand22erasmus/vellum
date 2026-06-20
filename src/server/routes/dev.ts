/**
 * Dev-only webhook delivery history API.
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { env } from '../../lib/env.ts';
import { prisma } from '../../lib/prisma.ts';
import { ok } from './http-helpers.ts';

/** Express router mounted at `/api/dev`. */
export const devRouter = Router();

const listQuery = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).max(50_000).default(0),
});

devRouter.get(
  '/webhook-deliveries',
  asyncHandler(async (req, res) => {
    if (env.isProduction) {
      throw AppError.notFound('Webhook delivery API is not available in production.');
    }

    const parsed = listQuery.safeParse(req.query);
    const { limit, offset } = parsed.success ? parsed.data : { limit: 50, offset: 0 };

    const [deliveries, total] = await Promise.all([
      prisma.webhookDelivery.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.webhookDelivery.count(),
    ]);

    ok(req, res, {
      deliveries: deliveries.map((row) => ({
        id: row.id,
        deliveryId: row.deliveryId,
        auditLogId: row.auditLogId,
        eventType: row.eventType,
        targetUrl: row.targetUrl,
        payload: row.payload,
        responseStatus: row.responseStatus,
        responseBody: row.responseBody,
        success: row.success,
        attempt: row.attempt,
        createdAt: row.createdAt.toISOString(),
      })),
      total,
      limit,
      offset,
    });
  }),
);
