/**
 * Admin document detail with revoke action.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from '@tanstack/react-router';
import { toast } from 'sonner';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { FileSha256Display } from '@/components/features/file-sha256-display';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { useAdminDocumentQuery, useRevokeDocumentMutation } from '@/lib/queries/admin';

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
  const revoke = useRevokeDocumentMutation();

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

  async function handleRevoke() {
    if (!doc || doc.revokedAt) return;
    if (!window.confirm('Revoke this link and delete the file from storage immediately?')) {
      return;
    }
    try {
      const message = await revoke.mutateAsync(doc.id);
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Revoke failed');
    }
  }

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
        <div className="flex gap-2">
          {!doc.revokedAt && doc.fileAvailable ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={revoke.isPending}
              onClick={() => void handleRevoke()}
            >
              Revoke link
            </Button>
          ) : null}
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath('/admin/documents')}>Back to list</Link>
          </Button>
        </div>
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
              maxDownloads={doc.maxDownloads}
              downloadCount={doc.downloadCount}
              downloadsRemaining={doc.downloadsRemaining}
              revokedAt={doc.revokedAt}
              deletedAt={doc.deletedAt}
            />
          </dd>
        </div>
        <div className="sm:col-span-2">
          <FileSha256Display sha256={doc.sha256} fileName={doc.fileName} />
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
