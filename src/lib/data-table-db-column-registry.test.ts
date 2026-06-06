/**
 * Tests for Prisma-backed column metadata registry.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';
import { DB_MODEL_NAMES } from './data-table-db-schema';
import {
  getDbColumnDescriptor,
  listDbColumnsForModel,
  mergeColumnMetaWithDb,
  resolveDbColumnMeta,
} from './data-table-db-column-registry';

describe('data-table-db-column-registry', () => {
  it('registers every Prisma model', () => {
    expect(DB_MODEL_NAMES).toEqual([
      'User',
      'Document',
      'AuditLog',
      'FailedAuditLog',
      'ProcessError',
      'FailedProcessError',
    ]);
  });

  it('maps User.email to email filter type', () => {
    const meta = resolveDbColumnMeta('email', undefined, 'User');
    expect(meta?.dataType).toBe('email');
    expect(meta?.descriptor.unique).toBe(true);
  });

  it('maps User.kind to enum with role options', () => {
    const meta = resolveDbColumnMeta('kind', undefined, 'User');
    expect(meta?.dataType).toBe('enum');
    expect(meta?.enumOptions?.map((option) => option.value)).toEqual(['ADMIN', 'CONSUMER']);
  });

  it('maps AuditLog.eventType to audit enum options', () => {
    const meta = resolveDbColumnMeta('eventType', undefined, 'AuditLog');
    expect(meta?.dataType).toBe('enum');
    expect(meta?.enumOptions).toHaveLength(6);
  });

  it('maps ProcessError.status to number filter type', () => {
    const meta = resolveDbColumnMeta('status', undefined, 'ProcessError');
    expect(meta?.dataType).toBe('number');
    expect(meta?.descriptor.scalar).toBe('Int');
  });

  it('maps reconciledAt to nullable-presence boolean filter', () => {
    const meta = resolveDbColumnMeta('reconciledAt', undefined, 'ProcessError');
    expect(meta?.dataType).toBe('boolean');
    expect(meta?.filterAs).toBe('nullable-presence');
  });

  it('maps derived document status facet', () => {
    const meta = resolveDbColumnMeta('status', undefined, 'Document');
    expect(meta?.dataType).toBe('enum');
    expect(meta?.filterAs).toBe('document-status-facet');
  });

  it('mergeColumnMetaWithDb preserves explicit overrides', () => {
    const merged = mergeColumnMetaWithDb('fileName', { dataType: 'number' }, undefined);
    expect(merged.dataType).toBe('number');
  });

  it('mergeColumnMetaWithDb fills from registry when dataType omitted', () => {
    const merged = mergeColumnMetaWithDb('recipientEmail', { dbModel: 'Document' }, undefined);
    expect(merged.dataType).toBe('email');
    expect(merged.dbField).toBe('recipientEmail');
  });

  it('lists all User columns from schema registry', () => {
    const fields = listDbColumnsForModel('User').map((column: { field: string }) => column.field);
    expect(fields).toContain('email');
    expect(fields).toContain('emailVerified');
    expect(getDbColumnDescriptor('User', 'createdAt')?.scalar).toBe('DateTime');
  });
});
