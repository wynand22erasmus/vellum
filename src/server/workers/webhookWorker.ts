/**
 * Delivers signed audit webhooks to configured integrator URLs.
 *
 * @packageDocumentation
 */

import { Worker } from 'bullmq';
import { randomUUID } from 'node:crypto';
import { createDeadLetter } from '../../lib/dead-letter.ts';
import { DeadLetterPipeline } from '../../../generated/enums.ts';
import { prisma } from '../../lib/prisma.ts';
import { env } from '../../lib/env.ts';
import { buildWebhookPayload } from '../../lib/webhooks/build-webhook-payload.ts';
import { signWebhookPayload } from '../../lib/webhooks/sign-payload.ts';
import { webhookUrlForEventType } from '../../lib/webhooks/webhook-url-registry.ts';
import { recordProcessError } from '../../lib/errors/record-process-error.ts';
import { problemFromError } from '../../lib/errors/problem-from-error.ts';
import { redisConnection } from '../../lib/redis.ts';
import type { WebhookDeliveryJobData } from '../queues/webhookQueue.ts';

const RESPONSE_BODY_MAX_LEN = 4096;
const WEBHOOK_USER_AGENT = 'Vellum-Webhook/1.0';
const WEBHOOK_TIMEOUT_MS = 15_000;

/** @internal */
function truncateResponseBody(body: string): string {
  if (body.length <= RESPONSE_BODY_MAX_LEN) {
    return body;
  }
  return `${body.slice(0, RESPONSE_BODY_MAX_LEN)}…`;
}

/**
 * Consumes `deliver-webhook` jobs: POST signed JSON to the configured target URL.
 */
export const webhookWorker = new Worker(
  'webhook-queue',
  async (job) => {
    const data = job.data as WebhookDeliveryJobData;
    const attempt = (job.attemptsMade ?? 0) + 1;
    const deliveryId = randomUUID();
    const targetUrl = webhookUrlForEventType(data.eventType);

    if (!targetUrl) {
      return;
    }

    const auditLog = await prisma.auditLog.findUnique({
      where: { auditLogId: data.auditLogId },
    });

    if (!auditLog) {
      throw new Error(`Audit log ${data.auditLogId} was not found for webhook delivery.`);
    }

    const payload = buildWebhookPayload(auditLog, deliveryId);
    const rawBody = JSON.stringify(payload);
    const secret = env.webhookSecret();
    const signature = signWebhookPayload(rawBody, secret);

    let responseStatus: number | null = null;
    let responseBody: string | null = null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Vellum-Event-Type': data.eventType,
          'X-Vellum-Delivery-Id': deliveryId,
          'X-Vellum-Signature': signature,
          'User-Agent': WEBHOOK_USER_AGENT,
        },
        body: rawBody,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      responseStatus = response.status;
      responseBody = truncateResponseBody(await response.text());

      if (!response.ok) {
        throw new Error(
          `Webhook delivery failed with HTTP ${response.status} from ${targetUrl}.`,
        );
      }
    } catch (err) {
      if (responseStatus === null) {
        responseBody = truncateResponseBody(
          err instanceof Error ? err.message : String(err),
        );
      }

      await prisma.webhookDelivery.create({
        data: {
          deliveryId,
          auditLogId: data.auditLogId,
          eventType: data.eventType,
          targetUrl,
          payload: payload as object,
          responseStatus: responseStatus ?? undefined,
          responseBody: responseBody ?? undefined,
          success: false,
          attempt,
        },
      });

      throw err;
    }

    await prisma.webhookDelivery.create({
      data: {
        deliveryId,
        auditLogId: data.auditLogId,
        eventType: data.eventType,
        targetUrl,
        payload: payload as object,
        responseStatus: responseStatus ?? undefined,
        responseBody: responseBody ?? undefined,
        success: true,
        attempt,
      },
    });
  },
  { connection: redisConnection },
);

webhookWorker.on('failed', async (job, err) => {
  if (!job) {
    return;
  }

  const attempts = job.opts.attempts ?? env.webhookMaxRetries;
  if ((job.attemptsMade ?? 0) < attempts) {
    return;
  }

  const jobData = job.data as WebhookDeliveryJobData;

  try {
    await createDeadLetter({
      pipeline: DeadLetterPipeline.WEBHOOK,
      payload: jobData,
      error: err instanceof Error ? err.message : String(err),
    });
  } catch {
    // Fall through to process error pipeline
  }

  const { problem, internal } = problemFromError(err);
  recordProcessError({
    problemType: problem.type,
    title: problem.title,
    status: problem.status,
    detail: problem.detail ?? problem.title,
    source: 'worker',
    documentId: undefined,
    jobId: job.id,
    jobName: job.name,
    internal: { ...internal, webhookPayload: jobData },
  });
});
