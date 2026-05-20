/**
 * Read-only admin API: lists and detail views for Postgres-backed models.
 *
 * @packageDocumentation
 * @remarks
 * Mounted at `/api/admin` behind {@link ../middleware/adminAuth.ts}. Never exposes
 * `passwordHash`, `downloadToken`, or raw `s3Key`.
 */

import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.ts';
import { AuditEventType } from '../../generated/enums.ts';

/** Express router mounted at `/api/admin`. */
export const adminRouter = Router();

const paginationQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).max(50_000).default(0),
});

const auditEventTypeSchema = z.enum([
  AuditEventType.USER_LOGIN,
  AuditEventType.EMAIL_INITIAL_SENT,
  AuditEventType.EMAIL_REGENERATE_SENT,
  AuditEventType.FILE_DOWNLOAD_SUCCESS,
  AuditEventType.FILE_DOWNLOAD_FAILED,
  AuditEventType.FILE_SCRUBBED,
]);

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

adminRouter.get('/documents', async (req, res) => {
  const parsed = paginationQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters.' });
    return;
  }
  const { limit, offset } = parsed.data;
  const recipientEmail =
    typeof req.query.recipientEmail === 'string' && req.query.recipientEmail.trim().length > 0
      ? req.query.recipientEmail.trim().slice(0, 320)
      : undefined;

  const where = recipientEmail ? { recipientEmail } : {};

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
});

adminRouter.get('/documents/:id', async (req, res) => {
  const id = req.params.id;
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
    res.status(404).json({ error: 'Document not found.' });
    return;
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
});

adminRouter.get('/users', async (req, res) => {
  const parsed = paginationQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters.' });
    return;
  }
  const { limit, offset } = parsed.data;

  const [total, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
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
});

adminRouter.get('/audit-logs', async (req, res) => {
  const parsed = paginationQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters.' });
    return;
  }
  const { limit, offset } = parsed.data;

  const eventTypeRaw = req.query.eventType;
  const eventTypeParsed =
    typeof eventTypeRaw === 'string' && eventTypeRaw.length > 0
      ? auditEventTypeSchema.safeParse(eventTypeRaw)
      : { success: true as const, data: undefined };

  if (!eventTypeParsed.success) {
    res.status(400).json({ error: 'Invalid eventType filter.' });
    return;
  }

  const documentId =
    typeof req.query.documentId === 'string' && req.query.documentId.trim().length > 0
      ? req.query.documentId.trim()
      : undefined;

  const from =
    typeof req.query.from === 'string' && req.query.from.length > 0
      ? new Date(req.query.from)
      : undefined;
  const to =
    typeof req.query.to === 'string' && req.query.to.length > 0
      ? new Date(req.query.to)
      : undefined;

  if (from && Number.isNaN(from.getTime())) {
    res.status(400).json({ error: 'Invalid from date.' });
    return;
  }
  if (to && Number.isNaN(to.getTime())) {
    res.status(400).json({ error: 'Invalid to date.' });
    return;
  }

  const where = {
    ...(eventTypeParsed.data ? { eventType: eventTypeParsed.data } : {}),
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
    })),
    total,
    limit,
    offset,
  });
});

adminRouter.get('/failed-audit-logs', async (req, res) => {
  const parsed = paginationQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid query parameters.' });
    return;
  }
  const { limit, offset } = parsed.data;

  const [total, rows] = await Promise.all([
    prisma.failedAuditLog.count(),
    prisma.failedAuditLog.findMany({
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
    failedAuditLogs: rows.map((r) => ({
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
});
