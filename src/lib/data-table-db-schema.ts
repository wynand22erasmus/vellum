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
  DEAD_LETTER_PIPELINE_FILTER_OPTIONS,
  RECIPIENT_OTP_CHANNEL_FILTER_OPTIONS,
  USER_KIND_FILTER_OPTIONS,
} from './data-table-enum-options.ts';
import type { DataTableColumnDataType, DataTableFilterOption } from './data-table-types.ts';

/** Prisma models exposed in admin/dashboard tables. */
export const DB_MODEL_NAMES = [
  'User',
  'File',
  'Recipient',
  'Document',
  'Communication',
  'AuditLog',
  'DeadLetter',
  'ProcessError',
  'WebhookDelivery',
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
    userId: col('User', 'userId', 'String', 'text', { unique: true }),
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
  File: {
    fileId: col('File', 'fileId', 'String', 'text', { unique: true }),
    sha256: col('File', 'sha256', 'String', 'text', { unique: true }),
    s3Key: col('File', 's3Key', 'String', 'text', { nullable: true }),
    fileName: col('File', 'fileName', 'String', 'text'),
    fileExpiresAt: col('File', 'fileExpiresAt', 'DateTime', 'datetime'),
    recordExpiresAt: col('File', 'recordExpiresAt', 'DateTime', 'datetime'),
    deletedAt: col('File', 'deletedAt', 'DateTime', 'datetime', {
      nullable: true,
      filterAs: 'nullable-presence',
    }),
    createdAt: col('File', 'createdAt', 'DateTime', 'datetime'),
    updatedAt: col('File', 'updatedAt', 'DateTime', 'datetime'),
    byteSize: col('File', 'byteSize', 'Int', 'number', { nullable: true }),
  },
  Recipient: {
    recipientId: col('Recipient', 'recipientId', 'String', 'text', { unique: true }),
    sourceSystemKey: col('Recipient', 'sourceSystemKey', 'String', 'text', { unique: true }),
    email: col('Recipient', 'email', 'String', 'email', { indexed: true }),
    phoneNumber: col('Recipient', 'phoneNumber', 'String', 'text', { nullable: true }),
    otpChannel: col('Recipient', 'otpChannel', 'Enum', 'enum', {
      prismaEnum: 'RecipientOtpChannel',
      nullable: true,
      enumOptions: RECIPIENT_OTP_CHANNEL_FILTER_OPTIONS,
    }),
    authenticatorSecretEnc: col('Recipient', 'authenticatorSecretEnc', 'String', 'text', {
      nullable: true,
      filterAs: 'nullable-presence',
    }),
    createdAt: col('Recipient', 'createdAt', 'DateTime', 'datetime'),
    updatedAt: col('Recipient', 'updatedAt', 'DateTime', 'datetime'),
  },
  Document: {
    documentId: col('Document', 'documentId', 'String', 'text', { unique: true }),
    fileId: col('Document', 'fileId', 'String', 'text', { indexed: true }),
    recipientId: col('Document', 'recipientId', 'String', 'text', { indexed: true }),
    passwordHash: col('Document', 'passwordHash', 'String', 'text'),
    maxDownloads: col('Document', 'maxDownloads', 'Int', 'number'),
    downloadCount: col('Document', 'downloadCount', 'Int', 'number'),
    verifySuccessCount: col('Document', 'verifySuccessCount', 'Int', 'number'),
    lastVerifiedAt: col('Document', 'lastVerifiedAt', 'DateTime', 'datetime', { nullable: true }),
    batchId: col('Document', 'batchId', 'String', 'text', { nullable: true, indexed: true }),
    createdAt: col('Document', 'createdAt', 'DateTime', 'datetime'),
    updatedAt: col('Document', 'updatedAt', 'DateTime', 'datetime'),
  },
  Communication: {
    communicationId: col('Communication', 'communicationId', 'String', 'text', { unique: true }),
    documentId: col('Communication', 'documentId', 'String', 'text', { indexed: true }),
    downloadToken: col('Communication', 'downloadToken', 'String', 'text', { unique: true }),
    linkExpiresAt: col('Communication', 'linkExpiresAt', 'DateTime', 'datetime'),
    revokedAt: col('Communication', 'revokedAt', 'DateTime', 'datetime', { nullable: true }),
    createdAt: col('Communication', 'createdAt', 'DateTime', 'datetime'),
    updatedAt: col('Communication', 'updatedAt', 'DateTime', 'datetime'),
  },
  AuditLog: {
    auditLogId: col('AuditLog', 'auditLogId', 'String', 'text', { unique: true }),
    eventType: col('AuditLog', 'eventType', 'Enum', 'enum', {
      prismaEnum: 'AuditEventType',
      enumOptions: AUDIT_EVENT_TYPE_FILTER_OPTIONS,
    }),
    createdAt: col('AuditLog', 'createdAt', 'DateTime', 'datetime'),
    userId: col('AuditLog', 'userId', 'String', 'text', { nullable: true }),
    documentId: col('AuditLog', 'documentId', 'String', 'text', { nullable: true }),
    communicationId: col('AuditLog', 'communicationId', 'String', 'text', { nullable: true, indexed: true }),
    ipAddress: col('AuditLog', 'ipAddress', 'String', 'text', { nullable: true }),
    userAgent: col('AuditLog', 'userAgent', 'String', 'text', { nullable: true }),
    metadata: col('AuditLog', 'metadata', 'Json', 'text', { nullable: true }),
    processErrorId: col('AuditLog', 'processErrorId', 'String', 'text', { nullable: true, indexed: true }),
    expiresAt: col('AuditLog', 'expiresAt', 'DateTime', 'datetime'),
  },
  DeadLetter: {
    deadLetterId: col('DeadLetter', 'deadLetterId', 'String', 'text', { unique: true }),
    pipeline: col('DeadLetter', 'pipeline', 'Enum', 'enum', {
      prismaEnum: 'DeadLetterPipeline',
      enumOptions: DEAD_LETTER_PIPELINE_FILTER_OPTIONS,
      indexed: true,
    }),
    payload: col('DeadLetter', 'payload', 'Json', 'text'),
    error: col('DeadLetter', 'error', 'String', 'text'),
    createdAt: col('DeadLetter', 'createdAt', 'DateTime', 'datetime', { indexed: true }),
    retried: col('DeadLetter', 'retried', 'Boolean', 'boolean', { indexed: true }),
    linkedTable: col('DeadLetter', 'linkedTable', 'String', 'text', { nullable: true, indexed: true }),
    linkedId: col('DeadLetter', 'linkedId', 'String', 'text', { nullable: true, indexed: true }),
  },
  ProcessError: {
    processErrorId: col('ProcessError', 'processErrorId', 'String', 'text', { unique: true }),
    problemType: col('ProcessError', 'problemType', 'String', 'text'),
    title: col('ProcessError', 'title', 'String', 'text'),
    status: col('ProcessError', 'status', 'Int', 'number'),
    detail: col('ProcessError', 'detail', 'String', 'text'),
    instance: col('ProcessError', 'instance', 'String', 'text', { nullable: true }),
    requestId: col('ProcessError', 'requestId', 'String', 'text', { nullable: true }),
    source: col('ProcessError', 'source', 'String', 'text'),
    userId: col('ProcessError', 'userId', 'String', 'text', { nullable: true }),
    documentId: col('ProcessError', 'documentId', 'String', 'text', { nullable: true }),
    communicationId: col('ProcessError', 'communicationId', 'String', 'text', { nullable: true, indexed: true }),
    extensions: col('ProcessError', 'extensions', 'Json', 'text', { nullable: true }),
    internal: col('ProcessError', 'internal', 'Json', 'text', { nullable: true }),
    reconciledAt: col('ProcessError', 'reconciledAt', 'DateTime', 'boolean', {
      nullable: true,
      filterAs: 'nullable-presence',
    }),
    reconcileAttempts: col('ProcessError', 'reconcileAttempts', 'Int', 'number'),
    createdAt: col('ProcessError', 'createdAt', 'DateTime', 'datetime'),
    deadLetterId: col('ProcessError', 'deadLetterId', 'String', 'text', { nullable: true, indexed: true }),
    auditLogId: col('ProcessError', 'auditLogId', 'String', 'text', { nullable: true, indexed: true }),
    correlationId: col('ProcessError', 'correlationId', 'String', 'text', { nullable: true, indexed: true }),
  },
  WebhookDelivery: {
    webhookDeliveryId: col('WebhookDelivery', 'webhookDeliveryId', 'String', 'text', { unique: true }),
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
    model: 'Communication',
    field: 'linkActive',
    scalar: 'Boolean',
    dataType: 'boolean',
    models: ['Communication', 'Document'],
  },
  fileAvailable: {
    model: 'Document',
    field: 'fileAvailable',
    scalar: 'Boolean',
    dataType: 'boolean',
    models: ['Document', 'File'],
  },
  storageAttached: {
    model: 'File',
    field: 'storageAttached',
    scalar: 'Boolean',
    dataType: 'boolean',
    models: ['File'],
  },
  documentCount: {
    model: 'File',
    field: 'documentCount',
    scalar: 'Int',
    dataType: 'number',
    models: ['File', 'Recipient'],
  },
  status: {
    model: 'Document',
    field: 'status',
    scalar: 'Enum',
    dataType: 'enum',
    filterAs: 'document-status-facet',
    enumOptions: DOCUMENT_STATUS_FILTER_OPTIONS,
    models: ['Document'],
  },
};

/** Table row kinds match Prisma model names exactly. */
export type TableRowKind = DbModelName;
