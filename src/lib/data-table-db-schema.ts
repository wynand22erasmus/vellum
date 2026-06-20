/**
 * Prisma schema field metadata for data-table filter type inference.
 *
 * Derived from `prisma/schema.prisma`. When the schema changes, update this registry
 * so column filters stay aligned with database types.
 *
 * @packageDocumentation
 */

import { DOCUMENT_STATUS_FILTER_OPTIONS } from './document-status-filter-options.ts';
import {
  AUDIT_EVENT_TYPE_FILTER_OPTIONS,
  RECIPIENT_OTP_CHANNEL_FILTER_OPTIONS,
  USER_KIND_FILTER_OPTIONS,
} from './data-table-enum-options.ts';
import type { DataTableColumnDataType, DataTableFilterOption } from './data-table-types.ts';

/** Prisma models exposed in admin/dashboard tables. */
export const DB_MODEL_NAMES = [
  'User',
  'DocumentFile',
  'DocumentUserLink',
  'AuditLog',
  'FailedAuditLog',
  'ProcessError',
  'FailedProcessError',
  'WebhookDelivery',
  'FailedWebhookDelivery',
] as const;

/** Prisma model name registered in {@link DB_COLUMN_DESCRIPTORS}. */
export type DbModelName = (typeof DB_MODEL_NAMES)[number];

/** Scalar kinds matching Prisma field types. */
export type DbScalarKind = 'String' | 'Boolean' | 'Int' | 'DateTime' | 'Json' | 'Enum';

/** How a nullable field should be filtered in the UI. */
export type DbColumnFilterAs = 'nullable-presence' | 'document-status-facet';

/** Metadata for one database column used to pick filter controls. */
export type DbColumnDescriptor = {
  model: DbModelName;
  field: string;
  scalar: DbScalarKind;
  prismaEnum?: string;
  nullable?: boolean;
  unique?: boolean;
  indexed?: boolean;
  dataType: DataTableColumnDataType;
  enumOptions?: readonly DataTableFilterOption[];
  /** When the stored type differs from filter semantics (e.g. nullable datetime → yes/no). */
  filterAs?: DbColumnFilterAs;
};

function col(
  model: DbModelName,
  field: string,
  scalar: DbScalarKind,
  dataType: DataTableColumnDataType,
  extra: Omit<DbColumnDescriptor, 'model' | 'field' | 'scalar' | 'dataType'> = {},
): DbColumnDescriptor {
  return { model, field, scalar, dataType, ...extra };
}

/** All Prisma fields keyed by model → field name. */
export const DB_COLUMN_DESCRIPTORS: Record<DbModelName, Record<string, DbColumnDescriptor>> = {
  User: {
    id: col('User', 'id', 'String', 'text', { unique: true }),
    email: col('User', 'email', 'String', 'email', { unique: true }),
    emailVerified: col('User', 'emailVerified', 'Boolean', 'boolean'),
    kind: col('User', 'kind', 'Enum', 'enum', {
      prismaEnum: 'UserKind',
      enumOptions: USER_KIND_FILTER_OPTIONS,
    }),
    firstName: col('User', 'firstName', 'String', 'text', { nullable: true }),
    lastName: col('User', 'lastName', 'String', 'text', { nullable: true }),
    profilePictureUrl: col('User', 'profilePictureUrl', 'String', 'text', { nullable: true }),
    lastSignInAt: col('User', 'lastSignInAt', 'DateTime', 'datetime', { nullable: true }),
    createdAt: col('User', 'createdAt', 'DateTime', 'datetime'),
    updatedAt: col('User', 'updatedAt', 'DateTime', 'datetime'),
  },
  DocumentFile: {
    id: col('DocumentFile', 'id', 'String', 'text', { unique: true }),
    sha256: col('DocumentFile', 'sha256', 'String', 'text', { unique: true }),
    s3Key: col('DocumentFile', 's3Key', 'String', 'text', { nullable: true }),
    fileName: col('DocumentFile', 'fileName', 'String', 'text'),
    fileExpiresAt: col('DocumentFile', 'fileExpiresAt', 'DateTime', 'datetime'),
    recordExpiresAt: col('DocumentFile', 'recordExpiresAt', 'DateTime', 'datetime'),
    deletedAt: col('DocumentFile', 'deletedAt', 'DateTime', 'datetime', {
      nullable: true,
      filterAs: 'nullable-presence',
    }),
    createdAt: col('DocumentFile', 'createdAt', 'DateTime', 'datetime'),
    byteSize: col('DocumentFile', 'byteSize', 'Int', 'number', { nullable: true }),
  },
  DocumentUserLink: {
    id: col('DocumentUserLink', 'id', 'String', 'text', { unique: true }),
    documentFileId: col('DocumentUserLink', 'documentFileId', 'String', 'text', { indexed: true }),
    recipientEmail: col('DocumentUserLink', 'recipientEmail', 'String', 'email', { indexed: true }),
    passwordHash: col('DocumentUserLink', 'passwordHash', 'String', 'text'),
    downloadToken: col('DocumentUserLink', 'downloadToken', 'String', 'text', { unique: true }),
    otpChannel: col('DocumentUserLink', 'otpChannel', 'Enum', 'enum', {
      prismaEnum: 'RecipientOtpChannel',
      nullable: true,
      enumOptions: RECIPIENT_OTP_CHANNEL_FILTER_OPTIONS,
    }),
    recipientPhone: col('DocumentUserLink', 'recipientPhone', 'String', 'text', { nullable: true }),
    totpSecretEnc: col('DocumentUserLink', 'totpSecretEnc', 'String', 'text', {
      nullable: true,
      filterAs: 'nullable-presence',
    }),
    linkExpiresAt: col('DocumentUserLink', 'linkExpiresAt', 'DateTime', 'datetime'),
    maxDownloads: col('DocumentUserLink', 'maxDownloads', 'Int', 'number'),
    downloadCount: col('DocumentUserLink', 'downloadCount', 'Int', 'number'),
    verifySuccessCount: col('DocumentUserLink', 'verifySuccessCount', 'Int', 'number'),
    lastVerifiedAt: col('DocumentUserLink', 'lastVerifiedAt', 'DateTime', 'datetime', { nullable: true }),
    isUsed: col('DocumentUserLink', 'isUsed', 'Boolean', 'boolean'),
    revokedAt: col('DocumentUserLink', 'revokedAt', 'DateTime', 'datetime', { nullable: true }),
    batchId: col('DocumentUserLink', 'batchId', 'String', 'text', { nullable: true, indexed: true }),
    createdAt: col('DocumentUserLink', 'createdAt', 'DateTime', 'datetime'),
  },
  AuditLog: {
    id: col('AuditLog', 'id', 'String', 'text', { unique: true }),
    eventType: col('AuditLog', 'eventType', 'Enum', 'enum', {
      prismaEnum: 'AuditEventType',
      enumOptions: AUDIT_EVENT_TYPE_FILTER_OPTIONS,
    }),
    timestamp: col('AuditLog', 'timestamp', 'DateTime', 'datetime'),
    userId: col('AuditLog', 'userId', 'String', 'text', { nullable: true }),
    documentId: col('AuditLog', 'documentId', 'String', 'text', { nullable: true }),
    ipAddress: col('AuditLog', 'ipAddress', 'String', 'text', { nullable: true }),
    userAgent: col('AuditLog', 'userAgent', 'String', 'text', { nullable: true }),
    metadata: col('AuditLog', 'metadata', 'Json', 'text', { nullable: true }),
    processErrorId: col('AuditLog', 'processErrorId', 'String', 'text', { nullable: true, indexed: true }),
    expiresAt: col('AuditLog', 'expiresAt', 'DateTime', 'datetime'),
  },
  FailedAuditLog: {
    id: col('FailedAuditLog', 'id', 'String', 'text', { unique: true }),
    payload: col('FailedAuditLog', 'payload', 'Json', 'text'),
    error: col('FailedAuditLog', 'error', 'String', 'text'),
    createdAt: col('FailedAuditLog', 'createdAt', 'DateTime', 'datetime'),
    retried: col('FailedAuditLog', 'retried', 'Boolean', 'boolean'),
    processErrorId: col('FailedAuditLog', 'processErrorId', 'String', 'text', { nullable: true, indexed: true }),
  },
  ProcessError: {
    id: col('ProcessError', 'id', 'String', 'text', { unique: true }),
    problemType: col('ProcessError', 'problemType', 'String', 'text'),
    title: col('ProcessError', 'title', 'String', 'text'),
    status: col('ProcessError', 'status', 'Int', 'number'),
    detail: col('ProcessError', 'detail', 'String', 'text'),
    instance: col('ProcessError', 'instance', 'String', 'text', { nullable: true }),
    requestId: col('ProcessError', 'requestId', 'String', 'text', { nullable: true }),
    source: col('ProcessError', 'source', 'String', 'text'),
    userId: col('ProcessError', 'userId', 'String', 'text', { nullable: true }),
    documentId: col('ProcessError', 'documentId', 'String', 'text', { nullable: true }),
    extensions: col('ProcessError', 'extensions', 'Json', 'text', { nullable: true }),
    internal: col('ProcessError', 'internal', 'Json', 'text', { nullable: true }),
    reconciledAt: col('ProcessError', 'reconciledAt', 'DateTime', 'boolean', {
      nullable: true,
      filterAs: 'nullable-presence',
    }),
    reconcileAttempts: col('ProcessError', 'reconcileAttempts', 'Int', 'number'),
    createdAt: col('ProcessError', 'createdAt', 'DateTime', 'datetime'),
    failedAuditLogId: col('ProcessError', 'failedAuditLogId', 'String', 'text', { nullable: true, indexed: true }),
    auditLogId: col('ProcessError', 'auditLogId', 'String', 'text', { nullable: true, indexed: true }),
    correlationId: col('ProcessError', 'correlationId', 'String', 'text', { nullable: true, indexed: true }),
  },
  FailedProcessError: {
    id: col('FailedProcessError', 'id', 'String', 'text', { unique: true }),
    payload: col('FailedProcessError', 'payload', 'Json', 'text'),
    error: col('FailedProcessError', 'error', 'String', 'text'),
    createdAt: col('FailedProcessError', 'createdAt', 'DateTime', 'datetime'),
    retried: col('FailedProcessError', 'retried', 'Boolean', 'boolean'),
  },
  WebhookDelivery: {
    id: col('WebhookDelivery', 'id', 'String', 'text', { unique: true }),
    deliveryId: col('WebhookDelivery', 'deliveryId', 'String', 'text', { unique: true }),
    auditLogId: col('WebhookDelivery', 'auditLogId', 'String', 'text', { indexed: true }),
    eventType: col('WebhookDelivery', 'eventType', 'Enum', 'enum', {
      prismaEnum: 'AuditEventType',
      enumOptions: AUDIT_EVENT_TYPE_FILTER_OPTIONS,
    }),
    targetUrl: col('WebhookDelivery', 'targetUrl', 'String', 'text'),
    payload: col('WebhookDelivery', 'payload', 'Json', 'text'),
    responseStatus: col('WebhookDelivery', 'responseStatus', 'Int', 'number', { nullable: true }),
    responseBody: col('WebhookDelivery', 'responseBody', 'String', 'text', { nullable: true }),
    success: col('WebhookDelivery', 'success', 'Boolean', 'boolean'),
    attempt: col('WebhookDelivery', 'attempt', 'Int', 'number'),
    createdAt: col('WebhookDelivery', 'createdAt', 'DateTime', 'datetime', { indexed: true }),
  },
  FailedWebhookDelivery: {
    id: col('FailedWebhookDelivery', 'id', 'String', 'text', { unique: true }),
    payload: col('FailedWebhookDelivery', 'payload', 'Json', 'text'),
    error: col('FailedWebhookDelivery', 'error', 'String', 'text'),
    createdAt: col('FailedWebhookDelivery', 'createdAt', 'DateTime', 'datetime'),
    retried: col('FailedWebhookDelivery', 'retried', 'Boolean', 'boolean'),
  },
};

/**
 * API-computed fields not stored as columns but shown in tables.
 */
export type DerivedColumnDescriptor = DbColumnDescriptor & {
  models?: readonly DbModelName[];
};

/** Registry of API-computed table columns (not direct Prisma fields). */
export const DERIVED_COLUMN_DESCRIPTORS: Record<string, DerivedColumnDescriptor> = {
  linkActive: {
    model: 'DocumentUserLink',
    field: 'linkActive',
    scalar: 'Boolean',
    dataType: 'boolean',
    models: ['DocumentUserLink'],
  },
  fileAvailable: {
    model: 'DocumentUserLink',
    field: 'fileAvailable',
    scalar: 'Boolean',
    dataType: 'boolean',
    models: ['DocumentUserLink', 'DocumentFile'],
  },
  storageAttached: {
    model: 'DocumentUserLink',
    field: 'storageAttached',
    scalar: 'Boolean',
    dataType: 'boolean',
    models: ['DocumentUserLink', 'DocumentFile'],
  },
  linkCount: {
    model: 'DocumentFile',
    field: 'linkCount',
    scalar: 'Int',
    dataType: 'number',
    models: ['DocumentFile'],
  },
  status: {
    model: 'DocumentUserLink',
    field: 'status',
    scalar: 'Enum',
    dataType: 'enum',
    filterAs: 'document-status-facet',
    enumOptions: DOCUMENT_STATUS_FILTER_OPTIONS,
    models: ['DocumentUserLink'],
  },
};

/** Maps frontend row type names to their primary Prisma model. */
export const TABLE_ROW_DB_MODEL = {
  AdminUserRow: 'User',
  AdminDocumentRow: 'DocumentUserLink',
  AdminDocumentFileRow: 'DocumentFile',
  DocumentRow: 'DocumentUserLink',
  AuditLogRow: 'AuditLog',
  AuditRow: 'AuditLog',
  FailedAuditLogRow: 'FailedAuditLog',
  ProcessErrorRow: 'ProcessError',
  FailedProcessErrorRow: 'FailedProcessError',
  WebhookDeliveryRow: 'WebhookDelivery',
  FailedWebhookDeliveryRow: 'FailedWebhookDelivery',
} as const satisfies Record<string, DbModelName>;

/** Frontend table row type name for registry lookup. */
export type TableRowKind = keyof typeof TABLE_ROW_DB_MODEL;
