/**
 * CSV serialization for admin audit log export.
 *
 * @packageDocumentation
 */

export type AuditLogExportRow = {
  auditLogId: string;
  eventType: string;
  createdAt: string;
  userId: string | null;
  documentId: string | null;
  communicationId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: unknown;
  expiresAt: string;
  processErrorId: string | null;
};

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Renders audit log rows as CSV with header row.
 */
export function auditLogsToCsv(rows: AuditLogExportRow[]): string {
  const header = [
    'auditLogId',
    'eventType',
    'createdAt',
    'userId',
    'documentId',
    'communicationId',
    'ipAddress',
    'userAgent',
    'metadata',
    'expiresAt',
    'processErrorId',
  ];

  const lines = [
    header.join(','),
    ...rows.map((row) =>
      [
        row.auditLogId,
        row.eventType,
        row.createdAt,
        row.userId ?? '',
        row.documentId ?? '',
        row.communicationId ?? '',
        row.ipAddress ?? '',
        row.userAgent ?? '',
        row.metadata === null || row.metadata === undefined
          ? ''
          : JSON.stringify(row.metadata),
        row.expiresAt,
        row.processErrorId ?? '',
      ]
        .map((cell) => escapeCsvField(String(cell)))
        .join(','),
    ),
  ];

  return `${lines.join('\n')}\n`;
}
