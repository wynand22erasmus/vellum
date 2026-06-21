/**
 * Admin document envelope detail with revoke-all-links action.
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
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import {
  type DocumentAuditLogSummary,
  type DocumentCommunicationSummary,
  useAdminDocumentQuery,
  useRevokeDocumentMutation,
} from '@/lib/queries/admin';

/** Admin document envelope detail with links and audit history. */
export function AdminDocumentDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: doc, isLoading, error } = useAdminDocumentQuery(id);
  const revoke = useRevokeDocumentMutation();

  const hasActiveLink = doc?.Communication.some((link) => link.linkActive) ?? false;

  const linkColumns = useMemo<ColumnDef<DocumentCommunicationSummary>[]>(
    () => [
      dbColumn<DocumentCommunicationSummary>('Communication', 'createdAt', 'Created'),
      dbColumn<DocumentCommunicationSummary>('Communication', 'linkExpiresAt', 'Expires'),
      dbColumn<DocumentCommunicationSummary>('Communication', 'linkActive', 'Active', {
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }),
      dbColumn<DocumentCommunicationSummary>('Communication', 'revokedAt', 'Revoked', {
        cell: ({ getValue }) => {
          const value = getValue() as string | null;
          return value ? new Date(value).toLocaleString() : '—';
        },
      }),
      disableColumnInteractions<DocumentCommunicationSummary>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/communications/${row.original.communicationId}`)}>Detail</Link>
          </Button>
        ),
      }),
    ],
    [],
  );

  const auditColumns = useMemo<ColumnDef<DocumentAuditLogSummary>[]>(
    () => [
      dbColumn<DocumentAuditLogSummary>('AuditLog', 'createdAt', 'Time'),
      dbColumn<DocumentAuditLogSummary>('AuditLog', 'eventType', 'Event'),
      dbColumn<DocumentAuditLogSummary>('AuditLog', 'communicationId', 'Link', {
        cell: ({ getValue }) => {
          const linkId = getValue() as string | null;
          if (!linkId) return '—';
          return (
            <Link
              to={normalizeAppPath(`/admin/communications/${linkId}`)}
              className="font-mono text-xs underline"
            >
              {linkId.slice(0, 8)}…
            </Link>
          );
        },
      }),
      dbColumn<DocumentAuditLogSummary>('AuditLog', 'ipAddress', 'IP', {
        cell: ({ getValue }) => getValue() ?? '—',
      }),
    ],
    [],
  );

  async function handleRevoke() {
    if (!doc || !hasActiveLink) return;
    if (
      !window.confirm(
        'Revoke all active download links for this document envelope? The shared file is retained when other envelopes reference it.',
      )
    ) {
      return;
    }
    try {
      const message = await revoke.mutateAsync(doc.documentId);
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
          {hasActiveLink && doc.fileAvailable ? (
            <Button
              variant="destructive"
              size="sm"
              disabled={revoke.isPending}
              onClick={() => void handleRevoke()}
            >
              Revoke all links
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
              maxDownloads={doc.maxDownloads}
              downloadCount={doc.downloadCount}
              downloadsRemaining={doc.downloadsRemaining}
              deletedAt={doc.deletedAt}
            />
          </dd>
        </div>
        <div className="sm:col-span-2">
          <FileSha256Display sha256={doc.sha256} fileName={doc.fileName} />
        </div>
      </dl>

      <h2 className="mb-4 text-lg font-semibold">Document links</h2>
      <div className="mb-8">
        <DataTable
          columns={linkColumns}
          data={doc.Communication}
          pageSize={25}
          emptyMessage="No outbound links for this document"
        />
      </div>

      <h2 className="mb-4 text-lg font-semibold">Audit trail</h2>
      <DataTable
        columns={auditColumns}
        data={doc.AuditLog}
        pageSize={25}
        emptyMessage="No audit events for this document"
      />
    </PageContainer>
  );
}
