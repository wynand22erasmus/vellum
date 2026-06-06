/**
 * Admin document detail.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from '@tanstack/react-router';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { useAdminDocumentQuery } from '@/lib/queries/admin';

type AuditLogRow = {
  id: string;
  timestamp: string;
  eventType: string;
  ipAddress: string | null;
};

/** Admin document detail view with audit history. */
export function AdminDocumentDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: doc, isLoading, error } = useAdminDocumentQuery(id);

  const auditColumns = useMemo<ColumnDef<AuditLogRow>[]>(
    () => [
      dbColumn<AuditLogRow>('AuditLog', 'timestamp', 'Time'),
      dbColumn<AuditLogRow>('AuditLog', 'eventType', 'Event'),
      dbColumn<AuditLogRow>('AuditLog', 'ipAddress', 'IP', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
    ],
    [],
  );

  if (isLoading) {
    return (
      <PageContainer variant="wide">
        <Skeleton className="h-8 w-64" />
      </PageContainer>
    );
  }

  if (error || !doc) {
    return (
      <PageContainer variant="wide">
        <Alert variant="destructive">
          <AlertDescription>{error?.message ?? 'Document not found'}</AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={doc.fileName}
      description={PAGE_LABELS.adminDocumentDetail.description}
      variant="wide"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link to={normalizeAppPath('/admin/documents')}>Back to list</Link>
        </Button>
      }
    >
      <dl className="mb-8 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Recipient</dt>
          <dd>{doc.recipientEmail}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Created</dt>
          <dd className="font-mono text-sm">{new Date(doc.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd>
            <DocumentStatusBadges
              linkActive={doc.linkActive}
              fileAvailable={doc.fileAvailable}
              isUsed={doc.isUsed}
              deletedAt={doc.deletedAt}
            />
          </dd>
        </div>
      </dl>

      <h2 className="mb-4 text-lg font-semibold">Audit trail</h2>
      <DataTable
        columns={auditColumns}
        data={doc.auditLogs}
        pageSize={25}
        emptyMessage="No audit events for this document"
      />
    </PageContainer>
  );
}
