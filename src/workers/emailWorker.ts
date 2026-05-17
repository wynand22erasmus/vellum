import { Worker } from 'bullmq';
import { prisma } from '../lib/prisma.ts';
import { EmailService } from '../lib/email/EmailService.ts';
import { auditQueue } from '../queues/auditQueue.ts';
import { redisConnection } from '../lib/redis.ts';

const emailService = new EmailService();

export const emailWorker = new Worker(
  'email-queue',
  async (job) => {
    const { docId, type, requestedBy } = job.data as {
      docId: string;
      type: 'INITIAL' | 'REGENERATE';
      requestedBy?: string;
    };

    const doc = await prisma.document.findUnique({ where: { id: docId } });
    if (!doc) throw new Error(`Document ${docId} not found`);

    await emailService.sendDownloadLink(
      doc.recipientEmail,
      doc.downloadToken,
      doc.fileName,
    );

    await auditQueue.add('log-event', {
      eventType:
        type === 'INITIAL' ? 'EMAIL_INITIAL_SENT' : 'EMAIL_REGENERATE_SENT',
      documentId: docId,
      metadata: { type, requestedBy },
    });
  },
  { connection: redisConnection },
);

emailWorker.on('failed', (job, err) => {
  console.error(`[emailWorker] Job ${job?.id} failed:`, err);
});
