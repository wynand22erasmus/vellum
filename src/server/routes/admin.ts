/**
 * Read-only admin API: lists and detail views for Postgres-backed models.
 *
 * @packageDocumentation
 */

import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { validationErrorFromZod } from '../../lib/errors/validation-detail.ts';
import { prisma } from '../../lib/prisma.ts';
import { AuditEventType, UserKind } from '../../../generated/enums.ts';
import { env } from '../../lib/env.ts';
import { auditLogsToCsv } from '../../lib/audit-export.ts';
import { ok } from './http-helpers.ts';

/** Express router mounted at `/api/admin`. */
export const adminRouter = Router();

function routeParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0]! : value;
}

const paginationQuery = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(50),
  offset: z.coerce.number().int().min(0).max(50_000).default(0),
});

const ALL_AUDIT_EVENT_TYPES = [
  AuditEventType.USER_LOGIN,
  AuditEventType.EMAIL_INITIAL_SENT,
  AuditEventType.EMAIL_REGENERATE_SENT,
  AuditEventType.FILE_DOWNLOAD_SUCCESS,
  AuditEventType.FILE_DOWNLOAD_FAILED,
  AuditEventType.FILE_SCRUBBED,
  AuditEventType.LINK_REVOKED,
  AuditEventType.CAPTCHA_FAILED,
  AuditEventType.RECIPIENT_OTP_SENT,
  AuditEventType.RECIPIENT_OTP_RESENT,
  AuditEventType.RECIPIENT_OTP_FAILED,
  AuditEventType.RECIPIENT_OTP_VERIFIED,
  AuditEventType.SFTP_FILE_RECEIVED,
  AuditEventType.SFTP_METADATA_VALIDATED,
  AuditEventType.SFTP_VIRUS_SCAN_PASSED,
  AuditEventType.SFTP_DOCUMENT_CREATED,
  AuditEventType.SFTP_STORAGE_UPLOADED,
  AuditEventType.SFTP_EMAIL_QUEUED,
  AuditEventType.SFTP_INGESTION_COMPLETED,
  AuditEventType.SFTP_INGESTION_FAILED,
] as const;

function parseAuditExportLimit(raw: unknown): number {
  const parsed = z.coerce.number().int().min(1).max(env.auditExportMaxLimit).safeParse(raw);
  return parsed.success ? parsed.data : Math.min(50, env.auditExportMaxLimit);
}

function wantsCsvExport(req: { query: Record<string, unknown>; accepts: (types: string[]) => string | false | null }): boolean {
  const format = trimQueryString(req.query.format, 16);
  if (format?.toLowerCase() === 'csv') {
    return true;
  }
  const accept = req.accepts(['text/csv', 'application/json']);
  return accept === 'text/csv';
}

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

function parseEnumListQuery<T extends string>(
  value: unknown,
  allowed: readonly T[],
  paramName: string,
  maxLen = 500,
): T[] | undefined {
  const raw = trimQueryString(value, maxLen);
  if (!raw) {
    return undefined;
  }
  const parts = raw.split(',').map((part) => part.trim()).filter(Boolean);
  const invalid = parts.filter((part) => !allowed.includes(part as T));
  if (invalid.length > 0) {
    throw AppError.badRequest(
      `Query parameter "${paramName}" has invalid value(s): ${invalid.join(', ')}.`,
    );
  }
  return parts.length > 0 ? (parts as T[]) : undefined;
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
    maxDownloads: number;
    downloadCount: number;
    revokedAt: Date | null;
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
    maxDownloads: doc.maxDownloads,
    downloadCount: doc.downloadCount,
    downloadsRemaining: Math.max(0, doc.maxDownloads - doc.downloadCount),
    revokedAt: doc.revokedAt?.toISOString() ?? null,
    deletedAt: doc.deletedAt?.toISOString() ?? null,
    createdAt: doc.createdAt.toISOString(),
    storageAttached: !!doc.s3Key,
    linkActive: now <= doc.linkExpiresAt && !!doc.s3Key && !doc.revokedAt,
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
            documentFile: {
              fileName: {
                contains: fileName,
                mode: 'insensitive' as const,
              },
            },
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.documentUserLink.count({ where }),
      prisma.documentUserLink.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          recipientEmail: true,
          linkExpiresAt: true,
          isUsed: true,
          maxDownloads: true,
          downloadCount: true,
          revokedAt: true,
          createdAt: true,
          documentFile: {
            select: {
              fileName: true,
              fileExpiresAt: true,
              recordExpiresAt: true,
              s3Key: true,
              deletedAt: true,
            },
          },
        },
      }),
    ]);

    const now = new Date();
    ok(req, res, {
      documents: rows.map((row) =>
        mapDocumentRow(
          {
            id: row.id,
            fileName: row.documentFile.fileName,
            recipientEmail: row.recipientEmail,
            linkExpiresAt: row.linkExpiresAt,
            fileExpiresAt: row.documentFile.fileExpiresAt,
            recordExpiresAt: row.documentFile.recordExpiresAt,
            isUsed: row.isUsed,
            maxDownloads: row.maxDownloads,
            downloadCount: row.downloadCount,
            revokedAt: row.revokedAt,
            s3Key: row.documentFile.s3Key,
            deletedAt: row.documentFile.deletedAt,
            createdAt: row.createdAt,
          },
          now,
        ),
      ),
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
    const link = await prisma.documentUserLink.findUnique({
      where: { id },
      select: {
        id: true,
        recipientEmail: true,
        linkExpiresAt: true,
        isUsed: true,
        maxDownloads: true,
        downloadCount: true,
        revokedAt: true,
        createdAt: true,
        documentFile: {
          select: {
            fileName: true,
            fileExpiresAt: true,
            recordExpiresAt: true,
            s3Key: true,
            deletedAt: true,
            sha256: true,
          },
        },
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

    if (!link) {
      throw AppError.notFound(`Document with id "${routeParam(req.params.id)}" was not found.`);
    }

    const now = new Date();
    const { auditLogs, documentFile, ...linkRest } = link;
    ok(req, res, {
      document: {
        ...mapDocumentRow(
          {
            id: linkRest.id,
            fileName: documentFile.fileName,
            recipientEmail: linkRest.recipientEmail,
            linkExpiresAt: linkRest.linkExpiresAt,
            fileExpiresAt: documentFile.fileExpiresAt,
            recordExpiresAt: documentFile.recordExpiresAt,
            isUsed: linkRest.isUsed,
            maxDownloads: linkRest.maxDownloads,
            downloadCount: linkRest.downloadCount,
            revokedAt: linkRest.revokedAt,
            s3Key: documentFile.s3Key,
            deletedAt: documentFile.deletedAt,
            createdAt: linkRest.createdAt,
          },
          now,
        ),
        sha256: documentFile.sha256,
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
      [UserKind.ADMIN, UserKind.CONSUMER] as const,
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

    ok(req, res, {
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
    const exportLimit = parseAuditExportLimit(req.query.limit);
    const cursor = trimQueryString(req.query.cursor, 64);
    const includeExpired = parseBooleanQuery(req.query.includeExpired) ?? false;

    const eventTypes = parseEnumListQuery(
      req.query.eventType,
      ALL_AUDIT_EVENT_TYPES,
      'eventType',
      256,
    );

    const documentId = trimQueryString(req.query.documentId, 64);
    const userId = trimQueryString(req.query.userId, 128);

    const dateRange = parseDateRangeQuery(req.query as Record<string, unknown>);
    if ('error' in dateRange) {
      throw AppError.badRequest(dateRange.error ?? 'Invalid date range.');
    }
    const { from, to } = dateRange;

    const now = new Date();
    const where = {
      ...(eventTypes?.length ? { eventType: { in: eventTypes } } : {}),
      ...(documentId ? { documentId } : {}),
      ...(userId ? { userId } : {}),
      ...(!includeExpired ? { expiresAt: { gt: now } } : {}),
      ...((from || to) && {
        timestamp: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }),
      ...(cursor
        ? {
            id: {
              lt: cursor,
            },
          }
        : {}),
    };

    const useOffset = !cursor && !wantsCsvExport(req);
    let limit = exportLimit;
    let offset = 0;

    if (useOffset) {
      const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
      limit = Math.min(parsed.limit, env.auditExportMaxLimit);
      offset = parsed.offset;
    }

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({
        where: {
          ...(eventTypes?.length ? { eventType: { in: eventTypes } } : {}),
          ...(documentId ? { documentId } : {}),
          ...(userId ? { userId } : {}),
          ...(!includeExpired ? { expiresAt: { gt: now } } : {}),
          ...((from || to) && {
            timestamp: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }),
        },
      }),
      prisma.auditLog.findMany({
        where,
        orderBy: [{ timestamp: 'desc' }, { id: 'desc' }],
        take: limit,
        ...(useOffset ? { skip: offset } : {}),
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

    const rows = logs.map((log) => ({
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
    }));

    if (wantsCsvExport(req)) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
      res.send(auditLogsToCsv(rows));
      return;
    }

    const nextCursor = rows.length === limit ? rows[rows.length - 1]?.id ?? null : null;

    ok(req, res, {
      auditLogs: rows,
      total,
      limit,
      ...(useOffset ? { offset } : {}),
      ...(cursor || !useOffset ? { nextCursor } : {}),
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

    ok(req, res, {
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

    ok(req, res, {
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

function mapDocumentFileRow(
  file: {
    id: string;
    sha256: string;
    s3Key: string | null;
    fileName: string;
    fileExpiresAt: Date;
    recordExpiresAt: Date;
    deletedAt: Date | null;
    createdAt: Date;
    byteSize: number | null;
    _count?: { userLinks: number };
  },
  now: Date,
) {
  return {
    id: file.id,
    sha256: file.sha256,
    fileName: file.fileName,
    fileExpiresAt: file.fileExpiresAt.toISOString(),
    recordExpiresAt: file.recordExpiresAt.toISOString(),
    deletedAt: file.deletedAt?.toISOString() ?? null,
    createdAt: file.createdAt.toISOString(),
    byteSize: file.byteSize,
    storageAttached: !!file.s3Key,
    fileAvailable: !!file.s3Key && now <= file.fileExpiresAt && !file.deletedAt,
    linkCount: file._count?.userLinks ?? 0,
  };
}

adminRouter.get(
  '/document-files',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const fileName = trimQueryString(req.query.fileName, 255);
    const sha256 = trimQueryString(req.query.sha256, 64);

    const where = {
      ...(fileName
        ? {
            fileName: {
              contains: fileName,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(sha256 ? { sha256 } : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.documentFile.count({ where }),
      prisma.documentFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          sha256: true,
          s3Key: true,
          fileName: true,
          fileExpiresAt: true,
          recordExpiresAt: true,
          deletedAt: true,
          createdAt: true,
          byteSize: true,
          _count: { select: { userLinks: true } },
        },
      }),
    ]);

    const now = new Date();
    ok(req, res, {
      documentFiles: rows.map((row) => mapDocumentFileRow(row, now)),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/document-files/:id',
  asyncHandler(async (req, res) => {
    const id = routeParam(req.params.id);
    const file = await prisma.documentFile.findUnique({
      where: { id },
      select: {
        id: true,
        sha256: true,
        s3Key: true,
        fileName: true,
        fileExpiresAt: true,
        recordExpiresAt: true,
        deletedAt: true,
        createdAt: true,
        byteSize: true,
        userLinks: {
          orderBy: { createdAt: 'desc' },
          take: 500,
          select: {
            id: true,
            recipientEmail: true,
            linkExpiresAt: true,
            isUsed: true,
            maxDownloads: true,
            downloadCount: true,
            revokedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!file) {
      throw AppError.notFound(`Document file with id "${id}" was not found.`);
    }

    const now = new Date();
    const { userLinks, ...fileRest } = file;
    ok(req, res, {
      documentFile: {
        ...mapDocumentFileRow({ ...fileRest, _count: { userLinks: userLinks.length } }, now),
        userLinks: userLinks.map((link) => ({
          id: link.id,
          recipientEmail: link.recipientEmail,
          linkExpiresAt: link.linkExpiresAt.toISOString(),
          isUsed: link.isUsed,
          maxDownloads: link.maxDownloads,
          downloadCount: link.downloadCount,
          revokedAt: link.revokedAt?.toISOString() ?? null,
          createdAt: link.createdAt.toISOString(),
        })),
      },
    });
  }),
);

adminRouter.get(
  '/webhook-deliveries',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const eventTypes = parseEnumListQuery(
      req.query.eventType,
      ALL_AUDIT_EVENT_TYPES,
      'eventType',
      256,
    );
    const success = parseBooleanQuery(req.query.success);
    const auditLogId = trimQueryString(req.query.auditLogId, 64);
    const dateRange = parseDateRangeQuery(req.query as Record<string, unknown>);
    if ('error' in dateRange) {
      throw AppError.badRequest(dateRange.error ?? 'Invalid date range.');
    }
    const { from, to } = dateRange;

    const where = {
      ...(eventTypes?.length ? { eventType: { in: eventTypes } } : {}),
      ...(success !== undefined ? { success } : {}),
      ...(auditLogId ? { auditLogId } : {}),
      ...((from || to) && {
        createdAt: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }),
    };

    const [total, rows] = await Promise.all([
      prisma.webhookDelivery.count({ where }),
      prisma.webhookDelivery.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          deliveryId: true,
          auditLogId: true,
          eventType: true,
          targetUrl: true,
          payload: true,
          responseStatus: true,
          responseBody: true,
          success: true,
          attempt: true,
          createdAt: true,
        },
      }),
    ]);

    ok(req, res, {
      webhookDeliveries: rows.map((row) => ({
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

adminRouter.get(
  '/failed-webhook-deliveries',
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
      prisma.failedWebhookDelivery.count({ where }),
      prisma.failedWebhookDelivery.findMany({
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

    ok(req, res, {
      failedWebhookDeliveries: rows.map((r) => ({
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

    ok(req, res, {
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
