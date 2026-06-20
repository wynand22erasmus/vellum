/**
 * Sends download-link emails and records related audit events.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import {
  documentUserLinkWithFileInclude,
  toDocumentContext,
} from '../../lib/documents/types.ts';
import { prisma } from '../../lib/prisma.ts';
import { EmailService } from '../../lib/email/EmailService.ts';
import { AppError } from '../../lib/errors/app-error.ts';
import { recordProcessError } from '../../lib/errors/record-process-error.ts';
import { problemFromError } from '../../lib/errors/problem-from-error.ts';
import { logEvent } from '../queues/auditQueue.ts';
import { redisConnection } from '../../lib/redis.ts';

/** @internal */
const emailService = new EmailService();

/**
 * Processes `email-queue` jobs: loads the document, sends mail, enqueues audit trail.
 */
export const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    const { docId, type, requestedBy } = job.data as {
      docId: string;
      type: 'INITIAL' | 'REGENERATE';
      requestedBy?: string;
    };

    const link = await prisma.documentUserLink.findUnique({
      where: { id: docId },
      include: documentUserLinkWithFileInclude,
    });
    if (!link) {
      throw AppError.notFound(
        `Document link ${docId} was not found while processing the email queue job.`,
      );
    }

    const doc = toDocumentContext(link);

    await emailService.sendDownloadLink(
      doc.recipientEmail,
      doc.downloadToken,
      doc.fileName,
    );

    logEvent({
      eventType:
        type === 'INITIAL' ? 'EMAIL_INITIAL_SENT' : 'EMAIL_REGENERATE_SENT',
      documentId: docId,
      metadata: { type, requestedBy },
    });
  },
  { connection: redisConnection },
);

emailWorker.on('failed', (job, err) => {
  const { problem, internal } = problemFromError(err);
  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    source: 'worker',
    documentId: (job?.data as { docId?: string })?.docId,
    jobId: job?.id,
    jobName: job?.name,
    internal,
  });
});
