/**
 * CSV serialization for admin audit log export.
 *
 * @packageDocumentation
 */

export type AuditLogExportRow = {
  id: string;
  eventType: string;
  timestamp: string;
  userId: string | null;
  documentId: string | null;
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
    'id',
    'eventType',
    'timestamp',
    'userId',
    'documentId',
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
        row.id,
        row.eventType,
        row.timestamp,
        row.userId ?? '',
        row.documentId ?? '',
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
