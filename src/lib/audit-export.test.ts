import { describe, expect, it } from 'vitest';
import { auditLogsToCsv } from './audit-export.ts';

describe('auditLogsToCsv', () => {
  it('escapes commas and quotes in metadata', () => {
    const csv = auditLogsToCsv([
      {
        id: 'log-1',
        eventType: 'LINK_REVOKED',
        timestamp: '2026-06-07T12:00:00.000Z',
        userId: null,
        documentId: 'doc-1',
        ipAddress: '127.0.0.1',
        userAgent: 'test',
        metadata: { note: 'a,b', quote: '"' },
        expiresAt: '2031-06-07T12:00:00.000Z',
        processErrorId: null,
      },
    ]);

    expect(csv).toContain('LINK_REVOKED');
    expect(csv.split('\n')).toHaveLength(3);
  });
});
