/**
 * Serialized admin and dashboard API shapes.
 *
 * Type names match Prisma model / PostgreSQL table names exactly.
 * Primary-key field names match foreign-key column names across tables.
 *
 * @packageDocumentation
 */

/** Dashboard user list row (`User` table). */
export type User = {
  userId: string;
  email: string;
  emailVerified: boolean;
  kind: string;
  firstName: string | null;
  lastName: string | null;
  lastSignInAt: string | null;
  createdAt: string;
  updatedAt?: string;
};

/** Shared file asset list row (`File` table + computed fields). */
export type File = {
  fileId: string;
  sha256: string;
  fileName: string;
  fileExpiresAt: string;
  recordExpiresAt: string;
  deletedAt: string | null;
  createdAt: string;
  byteSize: number | null;
  storageAttached: boolean;
  fileAvailable: boolean;
  documentCount: number;
};

/** Document envelope summary nested under `File` detail. */
export type FileDocumentSummary = {
  documentId: string;
  recipientEmail: string;
  createdAt: string;
  downloadCount: number;
  maxDownloads: number;
};

/** File detail with linked document envelopes. */
export type FileDetail = File & {
  Document: FileDocumentSummary[];
};

/** Recipient list row (`Recipient` table + computed fields). */
export type Recipient = {
  recipientId: string;
  sourceSystemKey: string;
  email: string;
  phoneNumber: string | null;
  otpChannel: string | null;
  createdAt: string;
  updatedAt: string;
  documentCount: number;
};

/** Recipient detail with linked document envelopes. */
export type RecipientDetail = Recipient & {
  Document: Document[];
};

/** Communication list row (`Communication` table + joined fields). */
export type Communication = {
  communicationId: string;
  documentId: string;
  linkExpiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  linkActive: boolean;
  recipientEmail: string;
  fileName: string;
};

/** Audit log summary nested under communication detail. */
export type CommunicationAuditLogSummary = {
  auditLogId: string;
  eventType: string;
  createdAt: string;
  ipAddress: string | null;
};

/** Communication detail with audit trail. */
export type CommunicationDetail = Communication & {
  updatedAt: string;
  AuditLog: CommunicationAuditLogSummary[];
};

/** Document envelope list row (`Document` table + joined/computed fields). */
export type Document = {
  documentId: string;
  fileId: string;
  recipientId?: string;
  fileName: string;
  recipientEmail: string;
  createdAt: string;
  fileExpiresAt: string;
  recordExpiresAt?: string;
  maxDownloads: number;
  downloadCount: number;
  downloadsRemaining: number;
  revokedAt?: string | null;
  deletedAt: string | null;
  batchId?: string | null;
  communicationId?: string | null;
  linkExpiresAt?: string;
  linkActive: boolean;
  fileAvailable: boolean;
  storageAttached?: boolean;
};

/** Communication summary nested under document detail. */
export type DocumentCommunicationSummary = {
  communicationId: string;
  linkExpiresAt: string;
  revokedAt: string | null;
  createdAt: string;
  linkActive: boolean;
};

/** Audit log row nested under document detail. */
export type DocumentAuditLogSummary = {
  auditLogId: string;
  eventType: string;
  createdAt: string;
  communicationId: string | null;
  ipAddress: string | null;
};

/** Document detail with links and audit trail. */
export type DocumentDetail = Document & {
  sha256: string;
  Communication: DocumentCommunicationSummary[];
  AuditLog: DocumentAuditLogSummary[];
};

/** Audit log list row (`AuditLog` table). */
export type AuditLog = {
  auditLogId: string;
  eventType: string;
  createdAt: string;
  userId: string | null;
  documentId: string | null;
  communicationId: string | null;
  ipAddress: string | null;
  userAgent?: string | null;
  metadata?: unknown;
  expiresAt?: string;
  processErrorId?: string | null;
};

/** Dead-letter list row (`DeadLetter` table). */
export type DeadLetter = {
  deadLetterId: string;
  pipeline: string;
  error: string;
  createdAt: string;
  retried: boolean;
  linkedTable: string | null;
  linkedId: string | null;
};

/** Process error list row (`ProcessError` table). */
export type ProcessError = {
  processErrorId: string;
  problemType?: string;
  title?: string;
  status: number;
  source: string;
  detail: string | null;
  createdAt: string;
  reconciledAt: string | null;
  deadLetterId?: string | null;
  auditLogId?: string | null;
  correlationId?: string | null;
  documentId?: string | null;
  communicationId?: string | null;
};

/** Webhook delivery list row (`WebhookDelivery` table). */
export type WebhookDelivery = {
  webhookDeliveryId: string;
  deliveryId?: string;
  auditLogId: string;
  eventType: string;
  targetUrl: string;
  payload: unknown;
  responseStatus: number | null;
  responseBody?: string | null;
  success: boolean;
  attempt: number;
  createdAt: string;
};
