/**
 * Read-only admin API: lists and detail views for Postgres-backed models.
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../lib/errors/app-error.ts';
import { validationErrorFromZod } from '../lib/errors/validation-detail.ts';
import { prisma } from '../lib/prisma.ts';
import { AuditEventType, UserKind } from '../../generated/enums.ts';

/** Express router mounted at `/api/admin`. */
export const adminRouter = Router();

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0]! : value;
}

const paginationQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(50_000).default(0),
});

function trimQueryString(value: unknown, maxLen: number): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  return trimmed.slice(0, maxLen);
}

function parseBooleanQuery(value: unknown): boolean | undefined {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return undefined;
}

function parseEnumListQuery(
  value: unknown,
  allowed: readonly string[],
  paramName: string,
  maxLen = 500,
): string[] | undefined {
  const raw = trimQueryString(value, maxLen);
  if (!raw) {
    return undefined;
  }
  const parts = raw.split(',').map((part) => part.trim()).filter(Boolean);
  const invalid = parts.filter((part) => !allowed.includes(part));
  if (invalid.length > 0) {
    throw AppError.badRequest(
      `Query parameter "${paramName}" has invalid value(s): ${invalid.join(', ')}.`,
    );
  }
  return parts.length > 0 ? parts : undefined;
}

function parseDateRangeQuery(query: Record<string, unknown>) {
  const fromRaw = trimQueryString(query.from, 64);
  const toRaw = trimQueryString(query.to, 64);
  const from = fromRaw ? new Date(fromRaw) : undefined;
  const to = toRaw ? new Date(toRaw) : undefined;

  if (from && Number.isNaN(from.getTime())) {
    return {
      error: `Query parameter "from" must be a valid ISO 8601 date; received "${fromRaw}".`,
    };
  }
  if (to && Number.isNaN(to.getTime())) {
    return {
      error: `Query parameter "to" must be a valid ISO 8601 date; received "${toRaw}".`,
    };
  }

  return { from, to };
}

function parsePaginationQuery(query: Record<string, unknown>) {
  const parsed = paginationQuery.safeParse(query);
  if (!parsed.success) {
    throw validationErrorFromZod(
      parsed.error,
      'Admin list query pagination is invalid (expected limit 1–100, offset 0–50000).',
    );
  }
  return parsed.data;
}

function mapDocumentRow(
  doc: {
    id: string;
    fileName: string;
    recipientEmail: string;
    linkExpiresAt: Date;
    fileExpiresAt: Date;
    recordExpiresAt: Date;
    isUsed: boolean;
    s3Key: string | null;
    deletedAt: Date | null;
    createdAt: Date;
  },
  now: Date,
) {
  return {
    id: doc.id,
    fileName: doc.fileName,
    recipientEmail: doc.recipientEmail,
    linkExpiresAt: doc.linkExpiresAt.toISOString(),
    fileExpiresAt: doc.fileExpiresAt.toISOString(),
    recordExpiresAt: doc.recordExpiresAt.toISOString(),
    isUsed: doc.isUsed,
    deletedAt: doc.deletedAt?.toISOString() ?? null,
    createdAt: doc.createdAt.toISOString(),
    storageAttached: !!doc.s3Key,
    linkActive: now <= doc.linkExpiresAt && !!doc.s3Key,
    fileAvailable: !!doc.s3Key && now <= doc.fileExpiresAt,
  };
}

adminRouter.get(
  '/documents',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const recipientEmail = trimQueryString(req.query.recipientEmail, 320);
    const fileName = trimQueryString(req.query.fileName, 255);

    const where = {
      ...(recipientEmail ? { recipientEmail } : {}),
      ...(fileName
        ? {
            fileName: {
              contains: fileName,
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          fileName: true,
          recipientEmail: true,
          linkExpiresAt: true,
          fileExpiresAt: true,
          recordExpiresAt: true,
          isUsed: true,
          s3Key: true,
          deletedAt: true,
          createdAt: true,
        },
      }),
    ]);

    const now = new Date();
    res.json({
      documents: rows.map((d) => mapDocumentRow(d, now)),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/documents/:id',
  asyncHandler(async (req, res) => {
    const id = routeParam(req.params.id);
    const doc = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        fileName: true,
        recipientEmail: true,
        linkExpiresAt: true,
        fileExpiresAt: true,
        recordExpiresAt: true,
        isUsed: true,
        s3Key: true,
        deletedAt: true,
        createdAt: true,
        auditLogs: {
          orderBy: { timestamp: 'desc' },
          take: 500,
          select: {
            id: true,
            eventType: true,
            timestamp: true,
            userId: true,
            documentId: true,
            ipAddress: true,
            userAgent: true,
            metadata: true,
            expiresAt: true,
          },
        },
      },
    });

    if (!doc) {
      throw AppError.notFound(`Document with id "${routeParam(req.params.id)}" was not found.`);
    }

    const now = new Date();
    const { auditLogs, ...rest } = doc;
    res.json({
      document: {
        ...mapDocumentRow(rest, now),
        auditLogs: auditLogs.map((log) => ({
          id: log.id,
          eventType: log.eventType,
          timestamp: log.timestamp.toISOString(),
          userId: log.userId,
          documentId: log.documentId,
          ipAddress: log.ipAddress,
          userAgent: log.userAgent,
          metadata: log.metadata,
          expiresAt: log.expiresAt.toISOString(),
        })),
      },
    });
  }),
);

adminRouter.get(
  '/users',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const email = trimQueryString(req.query.email, 320);
    const kinds = parseEnumListQuery(
      req.query.kind,
      [UserKind.ADMIN, UserKind.CONSUMER],
      'kind',
      64,
    );
    const emailVerified = parseBooleanQuery(req.query.emailVerified);

    const where = {
      ...(email
        ? {
            email: {
              contains: email,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(kinds?.length ? { kind: { in: kinds } } : {}),
      ...(emailVerified !== undefined ? { emailVerified } : {}),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          email: true,
          emailVerified: true,
          kind: true,
          firstName: true,
          lastName: true,
          lastSignInAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    res.json({
      users: users.map((u) => ({
        ...u,
        lastSignInAt: u.lastSignInAt?.toISOString() ?? null,
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      })),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/audit-logs',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;

    const eventTypes = parseEnumListQuery(
      req.query.eventType,
      [
        AuditEventType.USER_LOGIN,
        AuditEventType.EMAIL_INITIAL_SENT,
        AuditEventType.EMAIL_REGENERATE_SENT,
        AuditEventType.FILE_DOWNLOAD_SUCCESS,
        AuditEventType.FILE_DOWNLOAD_FAILED,
        AuditEventType.FILE_SCRUBBED,
      ],
      'eventType',
      256,
    );

    const documentId = trimQueryString(req.query.documentId, 64);

    const dateRange = parseDateRangeQuery(req.query);
    if ('error' in dateRange) {
      throw AppError.badRequest(dateRange.error ?? 'Invalid date range.');
    }
    const { from, to } = dateRange;

    const where = {
      ...(eventTypes?.length ? { eventType: { in: eventTypes } } : {}),
      ...(documentId ? { documentId } : {}),
      ...((from || to) && {
        timestamp: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }),
    };

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          eventType: true,
          timestamp: true,
          userId: true,
          documentId: true,
          ipAddress: true,
          userAgent: true,
          metadata: true,
          expiresAt: true,
          processErrorId: true,
        },
      }),
    ]);

    res.json({
      auditLogs: logs.map((log) => ({
        id: log.id,
        eventType: log.eventType,
        timestamp: log.timestamp.toISOString(),
        userId: log.userId,
        documentId: log.documentId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        metadata: log.metadata,
        expiresAt: log.expiresAt.toISOString(),
        processErrorId: log.processErrorId,
      })),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/failed-audit-logs',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const errorFilter = trimQueryString(req.query.error, 500);
    const retried = parseBooleanQuery(req.query.retried);
    const dateRange = parseDateRangeQuery(req.query);
    if ('error' in dateRange) {
      throw AppError.badRequest(dateRange.error ?? 'Invalid date range.');
    }
    const { from, to } = dateRange;

    const where = {
      ...(errorFilter
        ? {
            error: {
              contains: errorFilter,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(retried !== undefined ? { retried } : {}),
      ...((from || to) && {
        createdAt: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }),
    };

    const [total, rows] = await Promise.all([
      prisma.failedAuditLog.count({ where }),
      prisma.failedAuditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          payload: true,
          error: true,
          createdAt: true,
          retried: true,
          processErrorId: true,
        },
      }),
    ]);

    res.json({
      failedAuditLogs: rows.map((r) => ({
        id: r.id,
        payload: r.payload,
        error: r.error,
        createdAt: r.createdAt.toISOString(),
        retried: r.retried,
        processErrorId: r.processErrorId,
      })),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/process-errors',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const source = trimQueryString(req.query.source, 32);
    const statusRaw = trimQueryString(req.query.status, 8);
    const status = statusRaw ? Number(statusRaw) : undefined;
    const hasOrphans = parseBooleanQuery(req.query.hasOrphans);
    const dateRange = parseDateRangeQuery(req.query);
    if ('error' in dateRange) {
      throw AppError.badRequest(dateRange.error ?? 'Invalid date range.');
    }
    const { from, to } = dateRange;

    const where = {
      ...(source ? { source } : {}),
      ...(status !== undefined && !Number.isNaN(status) ? { status } : {}),
      ...((from || to) && {
        createdAt: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }),
    };

    const [total, rows] = await Promise.all([
      prisma.processError.count({ where }),
      prisma.processError.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
    ]);

    let filtered = rows;
    if (hasOrphans === true) {
      filtered = rows.filter((row) => {
        const ext = row.extensions as { orphanedResources?: unknown[] } | null;
        return Array.isArray(ext?.orphanedResources) && ext.orphanedResources.length > 0;
      });
    } else if (hasOrphans === false) {
      filtered = rows.filter((row) => {
        const ext = row.extensions as { orphanedResources?: unknown[] } | null;
        return !Array.isArray(ext?.orphanedResources) || ext.orphanedResources.length === 0;
      });
    }

    res.json({
      processErrors: filtered.map((r) => ({
        id: r.id,
        problemType: r.problemType,
        title: r.title,
        status: r.status,
        detail: r.detail,
        instance: r.instance,
        requestId: r.requestId,
        source: r.source,
        userId: r.userId,
        documentId: r.documentId,
        extensions: r.extensions,
        failedAuditLogId: r.failedAuditLogId,
        auditLogId: r.auditLogId,
        correlationId: r.correlationId,
        reconciledAt: r.reconciledAt?.toISOString() ?? null,
        reconcileAttempts: r.reconcileAttempts,
        createdAt: r.createdAt.toISOString(),
      })),
      total: hasOrphans !== undefined ? filtered.length : total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/failed-process-errors',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const errorFilter = trimQueryString(req.query.error, 500);
    const retried = parseBooleanQuery(req.query.retried);
    const dateRange = parseDateRangeQuery(req.query);
    if ('error' in dateRange) {
      throw AppError.badRequest(dateRange.error ?? 'Invalid date range.');
    }
    const { from, to } = dateRange;

    const where = {
      ...(errorFilter
        ? {
            error: {
              contains: errorFilter,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(retried !== undefined ? { retried } : {}),
      ...((from || to) && {
        createdAt: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }),
    };

    const [total, rows] = await Promise.all([
      prisma.failedProcessError.count({ where }),
      prisma.failedProcessError.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          payload: true,
          error: true,
          createdAt: true,
          retried: true,
        },
      }),
    ]);

    res.json({
      failedProcessErrors: rows.map((r) => ({
        id: r.id,
        payload: r.payload,
        error: r.error,
        createdAt: r.createdAt.toISOString(),
        retried: r.retried,
      })),
      total,
      limit,
      offset,
    });
  }),
);
