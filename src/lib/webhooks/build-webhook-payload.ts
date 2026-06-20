/**
 * JSON body shape for outbound audit webhooks.
 *
 * @packageDocumentation
 */

import type { AuditEventType, AuditLog } from '../../../generated/client.ts';

/** Outbound webhook POST body (mirrors audit log fields). */
export type WebhookPayload = {
  deliveryId: string;
  eventType: AuditEventType;
  timestamp: string;
  auditLogId: string;
  documentId: string | null;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
};

/**
 * Builds the webhook JSON body from a persisted audit log row.
 *
 * @param auditLog - Source audit row
 * @param deliveryId - Unique id for this delivery attempt
 */
export function buildWebhookPayload(
  auditLog: Pick<
    AuditLog,
    'id' | 'eventType' | 'timestamp' | 'documentId' | 'userId' | 'ipAddress' | 'userAgent' | 'metadata'
  >,
  deliveryId: string,
): WebhookPayload {
  const metadata =
    auditLog.metadata && typeof auditLog.metadata === 'object' && !Array.isArray(auditLog.metadata)
      ? (auditLog.metadata as Record<string, unknown>)
      : null;

  return {
    deliveryId,
    eventType: auditLog.eventType,
    timestamp: auditLog.timestamp.toISOString(),
    auditLogId: auditLog.id,
    documentId: auditLog.documentId,
    userId: auditLog.userId,
    ipAddress: auditLog.ipAddress,
    userAgent: auditLog.userAgent,
    metadata,
  };
}
