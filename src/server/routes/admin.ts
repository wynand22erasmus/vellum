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
import { AuditEventType, DeadLetterPipeline, UserKind } from '../../../generated/enums.ts';
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
  AuditEventType.FILE_PURGED,
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

const ALL_DEAD_LETTER_PIPELINES = [
  DeadLetterPipeline.AUDIT,
  DeadLetterPipeline.PROCESS_ERROR,
  DeadLetterPipeline.WEBHOOK,
] as const;

const auditLogSelect = {
  auditLogId: true,
  eventType: true,
  createdAt: true,
  userId: true,
  documentId: true,
  communicationId: true,
  ipAddress: true,
  userAgent: true,
  metadata: true,
  expiresAt: true,
  processErrorId: true,
} as const;

const latestCommunicationSelect = {
  orderBy: { createdAt: 'desc' as const },
  take: 1,
  select: {
    communicationId: true,
    linkExpiresAt: true,
    revokedAt: true,
  },
};

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

function mapAuditLogRow(log: {
  auditLogId: string;
  eventType: AuditEventType;
  createdAt: Date;
  userId: string | null;
  documentId: string | null;
  communicationId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: unknown;
  expiresAt: Date;
  processErrorId: string | null;
}) {
  return {
    auditLogId: log.auditLogId,
    eventType: log.eventType,
    createdAt: log.createdAt.toISOString(),
    userId: log.userId,
    documentId: log.documentId,
    communicationId: log.communicationId,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    metadata: log.metadata,
    expiresAt: log.expiresAt.toISOString(),
    processErrorId: log.processErrorId,
  };
}

function mapCommunicationSummary(link: {
  communicationId: string;
  linkExpiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}) {
  return {
    communicationId: link.communicationId,
    linkExpiresAt: link.linkExpiresAt.toISOString(),
    revokedAt: link.revokedAt?.toISOString() ?? null,
    createdAt: link.createdAt.toISOString(),
  };
}

function mapDocumentEnvelopeRow(
  doc: {
    documentId: string;
    fileId: string;
    maxDownloads: number;
    downloadCount: number;
    batchId: string | null;
    createdAt: Date;
    file: {
      fileName: string;
      fileExpiresAt: Date;
      recordExpiresAt: Date;
      s3Key: string | null;
      deletedAt: Date | null;
    };
    recipient: {
      email: string;
    };
    communications: Array<{
      communicationId: string;
      linkExpiresAt: Date;
      revokedAt: Date | null;
    }>;
  },
  now: Date,
) {
  const link = doc.communications[0] ?? null;
  const linkExpiresAt = link?.linkExpiresAt ?? doc.createdAt;

  return {
    documentId: doc.documentId,
    fileId: doc.fileId,
    fileName: doc.file.fileName,
    recipientEmail: doc.recipient.email,
    linkExpiresAt: linkExpiresAt.toISOString(),
    fileExpiresAt: doc.file.fileExpiresAt.toISOString(),
    recordExpiresAt: doc.file.recordExpiresAt.toISOString(),
    maxDownloads: doc.maxDownloads,
    downloadCount: doc.downloadCount,
    downloadsRemaining: Math.max(0, doc.maxDownloads - doc.downloadCount),
    revokedAt: link?.revokedAt?.toISOString() ?? null,
    deletedAt: doc.file.deletedAt?.toISOString() ?? null,
    createdAt: doc.createdAt.toISOString(),
    batchId: doc.batchId,
    communicationId: link?.communicationId ?? null,
    storageAttached: !!doc.file.s3Key,
    linkActive:
      link !== null &&
      now <= link.linkExpiresAt &&
      !!doc.file.s3Key &&
      !link.revokedAt,
    fileAvailable: !!doc.file.s3Key && now <= doc.file.fileExpiresAt && !doc.file.deletedAt,
  };
}

function mapFileRow(
  file: {
    fileId: string;
    sha256: string;
    s3Key: string | null;
    fileName: string;
    fileExpiresAt: Date;
    recordExpiresAt: Date;
    deletedAt: Date | null;
    createdAt: Date;
    byteSize: number | null;
    _count?: { documents: number };
  },
  now: Date,
) {
  return {
    fileId: file.fileId,
    sha256: file.sha256,
    fileName: file.fileName,
    fileExpiresAt: file.fileExpiresAt.toISOString(),
    recordExpiresAt: file.recordExpiresAt.toISOString(),
    deletedAt: file.deletedAt?.toISOString() ?? null,
    createdAt: file.createdAt.toISOString(),
    byteSize: file.byteSize,
    storageAttached: !!file.s3Key,
    fileAvailable: !!file.s3Key && now <= file.fileExpiresAt && !file.deletedAt,
    documentCount: file._count?.documents ?? 0,
  };
}

function mapRecipientRow(recipient: {
  recipientId: string;
  sourceSystemKey: string;
  email: string;
  phoneNumber: string | null;
  otpChannel: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: { documents: number };
}) {
  return {
    recipientId: recipient.recipientId,
    sourceSystemKey: recipient.sourceSystemKey,
    email: recipient.email,
    phoneNumber: recipient.phoneNumber,
    otpChannel: recipient.otpChannel,
    createdAt: recipient.createdAt.toISOString(),
    updatedAt: recipient.updatedAt.toISOString(),
    documentCount: recipient._count?.documents ?? 0,
  };
}

function mapCommunicationListRow(link: {
  communicationId: string;
  documentId: string;
  linkExpiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
  document: {
    file: {
      fileName: string;
    };
    recipient: {
      email: string;
    };
  };
}) {
  return {
    communicationId: link.communicationId,
    documentId: link.documentId,
    linkExpiresAt: link.linkExpiresAt.toISOString(),
    revokedAt: link.revokedAt?.toISOString() ?? null,
    createdAt: link.createdAt.toISOString(),
    fileName: link.document.file.fileName,
    recipientEmail: link.document.recipient.email,
    document: {
      file: {
        fileName: link.document.file.fileName,
      },
      recipient: {
        email: link.document.recipient.email,
      },
    },
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
      ...(recipientEmail
        ? {
            recipient: {
              email: recipientEmail,
            },
          }
        : {}),
      ...(fileName
        ? {
            file: {
              fileName: {
                contains: fileName,
                mode: 'insensitive' as const,
              },
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
          documentId: true,
          fileId: true,
          maxDownloads: true,
          downloadCount: true,
          batchId: true,
          createdAt: true,
          file: {
            select: {
              fileName: true,
              fileExpiresAt: true,
              recordExpiresAt: true,
              s3Key: true,
              deletedAt: true,
            },
          },
          recipient: {
            select: {
              email: true,
            },
          },
          communications: latestCommunicationSelect,
        },
      }),
    ]);

    const now = new Date();
    ok(req, res, {
      Document: rows.map((row) => mapDocumentEnvelopeRow(row, now)),
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
    const document = await prisma.document.findUnique({
      where: { documentId: id },
      select: {
        documentId: true,
        fileId: true,
        maxDownloads: true,
        downloadCount: true,
        batchId: true,
        createdAt: true,
        file: {
          select: {
            fileName: true,
            fileExpiresAt: true,
            recordExpiresAt: true,
            s3Key: true,
            deletedAt: true,
            sha256: true,
          },
        },
        recipient: {
          select: {
            recipientId: true,
            sourceSystemKey: true,
            email: true,
            phoneNumber: true,
            otpChannel: true,
          },
        },
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 500,
          select: {
            communicationId: true,
            linkExpiresAt: true,
            revokedAt: true,
            createdAt: true,
          },
        },
      },
    });

    if (!document) {
      throw AppError.notFound(`Document with id "${id}" was not found.`);
    }

    const communicationIds = document.communications.map((link) => link.communicationId);
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        OR: [
          { documentId: id },
          ...(communicationIds.length > 0 ? [{ communicationId: { in: communicationIds } }] : []),
        ],
      },
      orderBy: [{ createdAt: 'desc' }, { auditLogId: 'desc' }],
      take: 500,
      select: auditLogSelect,
    });

    const now = new Date();
    const { communications, file, recipient, ...documentRest } = document;

    ok(req, res, {
      Document: {
        ...mapDocumentEnvelopeRow(
          {
            ...documentRest,
            file: {
              fileName: file.fileName,
              fileExpiresAt: file.fileExpiresAt,
              recordExpiresAt: file.recordExpiresAt,
              s3Key: file.s3Key,
              deletedAt: file.deletedAt,
            },
            recipient: {
              email: recipient.email,
            },
            communications: communications.map((link) => ({
              communicationId: link.communicationId,
              linkExpiresAt: link.linkExpiresAt,
              revokedAt: link.revokedAt,
            })),
          },
          now,
        ),
        sha256: file.sha256,
        recipient,
        Communication: communications.map(mapCommunicationSummary),
        AuditLog: auditLogs.map(mapAuditLogRow),
      },
    });
  }),
);

adminRouter.get(
  '/files',
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
      prisma.file.count({ where }),
      prisma.file.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          fileId: true,
          sha256: true,
          s3Key: true,
          fileName: true,
          fileExpiresAt: true,
          recordExpiresAt: true,
          deletedAt: true,
          createdAt: true,
          byteSize: true,
          _count: { select: { documents: true } },
        },
      }),
    ]);

    const now = new Date();
    ok(req, res, {
      File: rows.map((row) => mapFileRow(row, now)),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/files/:id',
  asyncHandler(async (req, res) => {
    const id = routeParam(req.params.id);
    const file = await prisma.file.findUnique({
      where: { fileId: id },
      select: {
        fileId: true,
        sha256: true,
        s3Key: true,
        fileName: true,
        fileExpiresAt: true,
        recordExpiresAt: true,
        deletedAt: true,
        createdAt: true,
        byteSize: true,
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 500,
          select: {
            documentId: true,
            createdAt: true,
            maxDownloads: true,
            downloadCount: true,
            recipient: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!file) {
      throw AppError.notFound(`File with id "${id}" was not found.`);
    }

    const now = new Date();
    const { documents, ...fileRest } = file;

    ok(req, res, {
      File: {
        ...mapFileRow({ ...fileRest, _count: { documents: documents.length } }, now),
        Document: documents.map((document) => ({
          documentId: document.documentId,
          recipientEmail: document.recipient.email,
          createdAt: document.createdAt.toISOString(),
          maxDownloads: document.maxDownloads,
          downloadCount: document.downloadCount,
        })),
      },
    });
  }),
);

adminRouter.get(
  '/recipients',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const email = trimQueryString(req.query.email, 320);
    const sourceSystemKey = trimQueryString(req.query.sourceSystemKey, 255);

    const where = {
      ...(email
        ? {
            email: {
              contains: email,
              mode: 'insensitive' as const,
            },
          }
        : {}),
      ...(sourceSystemKey ? { sourceSystemKey } : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.recipient.count({ where }),
      prisma.recipient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          recipientId: true,
          sourceSystemKey: true,
          email: true,
          phoneNumber: true,
          otpChannel: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { documents: true } },
        },
      }),
    ]);

    ok(req, res, {
      Recipient: rows.map(mapRecipientRow),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/recipients/:id',
  asyncHandler(async (req, res) => {
    const id = routeParam(req.params.id);
    const recipient = await prisma.recipient.findUnique({
      where: { recipientId: id },
      select: {
        recipientId: true,
        sourceSystemKey: true,
        email: true,
        phoneNumber: true,
        otpChannel: true,
        createdAt: true,
        updatedAt: true,
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 500,
          select: {
            documentId: true,
            fileId: true,
            maxDownloads: true,
            downloadCount: true,
            batchId: true,
            createdAt: true,
            file: {
              select: {
                fileName: true,
                fileExpiresAt: true,
                recordExpiresAt: true,
                s3Key: true,
                deletedAt: true,
              },
            },
            communications: latestCommunicationSelect,
          },
        },
      },
    });

    if (!recipient) {
      throw AppError.notFound(`Recipient with id "${id}" was not found.`);
    }

    const now = new Date();
    const { documents, ...recipientRest } = recipient;

    ok(req, res, {
      Recipient: {
        ...mapRecipientRow({ ...recipientRest, _count: { documents: documents.length } }),
        Document: documents.map((document) =>
          mapDocumentEnvelopeRow(
            {
              ...document,
              recipient: { email: recipient.email },
            },
            now,
          ),
        ),
      },
    });
  }),
);

adminRouter.get(
  '/communications',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const documentId = trimQueryString(req.query.documentId, 64);
    const recipientEmail = trimQueryString(req.query.recipientEmail, 320);
    const fileName = trimQueryString(req.query.fileName, 255);

    const where = {
      ...(documentId ? { documentId } : {}),
      ...(recipientEmail || fileName
        ? {
            document: {
              ...(recipientEmail
                ? {
                    recipient: {
                      email: recipientEmail,
                    },
                  }
                : {}),
              ...(fileName
                ? {
                    file: {
                      fileName: {
                        contains: fileName,
                        mode: 'insensitive' as const,
                      },
                    },
                  }
                : {}),
            },
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.communication.count({ where }),
      prisma.communication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          communicationId: true,
          documentId: true,
          linkExpiresAt: true,
          revokedAt: true,
          createdAt: true,
          document: {
            select: {
              file: {
                select: {
                  fileName: true,
                },
              },
              recipient: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    ok(req, res, {
      Communication: rows.map(mapCommunicationListRow),
      total,
      limit,
      offset,
    });
  }),
);

adminRouter.get(
  '/communications/:id',
  asyncHandler(async (req, res) => {
    const id = routeParam(req.params.id);
    const link = await prisma.communication.findUnique({
      where: { communicationId: id },
      select: {
        communicationId: true,
        documentId: true,
        linkExpiresAt: true,
        revokedAt: true,
        createdAt: true,
        updatedAt: true,
        document: {
          select: {
            documentId: true,
            maxDownloads: true,
            downloadCount: true,
            createdAt: true,
            file: {
              select: {
                fileName: true,
                fileExpiresAt: true,
                recordExpiresAt: true,
                s3Key: true,
                deletedAt: true,
              },
            },
            recipient: {
              select: {
                recipientId: true,
                email: true,
                sourceSystemKey: true,
              },
            },
          },
        },
      },
    });

    if (!link) {
      throw AppError.notFound(`Document link with id "${id}" was not found.`);
    }

    const auditLogs = await prisma.auditLog.findMany({
      where: {
        OR: [{ communicationId: id }, { documentId: link.documentId }],
      },
      orderBy: [{ createdAt: 'desc' }, { auditLogId: 'desc' }],
      take: 500,
      select: auditLogSelect,
    });

    const now = new Date();
    ok(req, res, {
      Communication: {
        communicationId: link.communicationId,
        documentId: link.documentId,
        linkExpiresAt: link.linkExpiresAt.toISOString(),
        revokedAt: link.revokedAt?.toISOString() ?? null,
        createdAt: link.createdAt.toISOString(),
        updatedAt: link.updatedAt.toISOString(),
        fileName: link.document.file.fileName,
        recipientEmail: link.document.recipient.email,
        linkActive:
          now <= link.linkExpiresAt &&
          !!link.document.file.s3Key &&
          !link.revokedAt &&
          now <= link.document.file.fileExpiresAt &&
          !link.document.file.deletedAt,
        AuditLog: auditLogs.map(mapAuditLogRow),
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
          userId: true,
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
      User: users.map((u) => ({
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
    const communicationId = trimQueryString(req.query.communicationId, 64);
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
      ...(communicationId ? { communicationId } : {}),
      ...(userId ? { userId } : {}),
      ...(!includeExpired ? { expiresAt: { gt: now } } : {}),
      ...((from || to) && {
        createdAt: {
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

    const countWhere = {
      ...(eventTypes?.length ? { eventType: { in: eventTypes } } : {}),
      ...(documentId ? { documentId } : {}),
      ...(communicationId ? { communicationId } : {}),
      ...(userId ? { userId } : {}),
      ...(!includeExpired ? { expiresAt: { gt: now } } : {}),
      ...((from || to) && {
        createdAt: {
          ...(from ? { gte: from } : {}),
          ...(to ? { lte: to } : {}),
        },
      }),
    };

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where: countWhere }),
      prisma.auditLog.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { auditLogId: 'desc' }],
        take: limit,
        ...(useOffset ? { skip: offset } : {}),
        select: auditLogSelect,
      }),
    ]);

    const rows = logs.map(mapAuditLogRow);

    if (wantsCsvExport(req)) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
      res.send(auditLogsToCsv(rows));
      return;
    }

    const nextCursor = rows.length === limit ? rows[rows.length - 1]?.auditLogId ?? null : null;

    ok(req, res, {
      AuditLog: rows,
      total,
      limit,
      ...(useOffset ? { offset } : {}),
      ...(cursor || !useOffset ? { nextCursor } : {}),
    });
  }),
);

adminRouter.get(
  '/dead-letters',
  asyncHandler(async (req, res) => {
    const parsed = parsePaginationQuery(req.query as Record<string, unknown>);
    const { limit, offset } = parsed;
    const pipelines = parseEnumListQuery(
      req.query.pipeline,
      ALL_DEAD_LETTER_PIPELINES,
      'pipeline',
      64,
    );
    const errorFilter = trimQueryString(req.query.error, 500);
    const retried = parseBooleanQuery(req.query.retried);
    const dateRange = parseDateRangeQuery(req.query);
    if ('error' in dateRange) {
      throw AppError.badRequest(dateRange.error ?? 'Invalid date range.');
    }
    const { from, to } = dateRange;

    const where = {
      ...(pipelines?.length ? { pipeline: { in: pipelines } } : {}),
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
      prisma.deadLetter.count({ where }),
      prisma.deadLetter.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          deadLetterId: true,
          pipeline: true,
          payload: true,
          error: true,
          createdAt: true,
          retried: true,
          linkedTable: true,
          linkedId: true,
        },
      }),
    ]);

    ok(req, res, {
      DeadLetter: rows.map((r) => ({
        deadLetterId: r.deadLetterId,
        pipeline: r.pipeline,
        payload: r.payload,
        error: r.error,
        createdAt: r.createdAt.toISOString(),
        retried: r.retried,
        linkedTable: r.linkedTable,
        linkedId: r.linkedId,
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
      ProcessError: filtered.map((r) => ({
        processErrorId: r.processErrorId,
        problemType: r.problemType,
        title: r.title,
        status: r.status,
        detail: r.detail,
        instance: r.instance,
        requestId: r.requestId,
        source: r.source,
        userId: r.userId,
        documentId: r.documentId,
        communicationId: r.communicationId,
        extensions: r.extensions,
        deadLetterId: r.deadLetterId,
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
          webhookDeliveryId: true,
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
      WebhookDelivery: rows.map((row) => ({
        webhookDeliveryId: row.webhookDeliveryId,
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
