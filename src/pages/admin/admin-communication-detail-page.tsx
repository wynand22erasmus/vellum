/**
 * Admin document link detail with audit history.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from '@tanstack/react-router';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn } from '@/components/data-table/column-helpers';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { type CommunicationAuditLogSummary, useAdminCommunicationQuery } from '@/lib/queries/admin';

/** Admin document link detail at `/admin/communications/:id`. */
export function AdminCommunicationDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: link, isLoading, error } = useAdminCommunicationQuery(id);

  const auditColumns = useMemo<ColumnDef<CommunicationAuditLogSummary>[]>(
    () => [
      dbColumn<CommunicationAuditLogSummary>('AuditLog', 'createdAt', 'Time'),
      dbColumn<CommunicationAuditLogSummary>('AuditLog', 'eventType', 'Event'),
      dbColumn<CommunicationAuditLogSummary>('AuditLog', 'ipAddress', 'IP', {
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

  if (error || !link) {
    return (
      <PageContainer variant="wide">
        <Alert variant="destructive">
          <AlertDescription>{error?.message ?? 'Document link not found'}</AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Link · ${link.fileName}`}
      description={PAGE_LABELS.adminCommunicationDetail.description}
      variant="wide"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link to={normalizeAppPath('/admin/communications')}>Back to list</Link>
        </Button>
      }
    >
      <dl className="mb-8 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Recipient</dt>
          <dd>{link.recipientEmail}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Document</dt>
          <dd>
            <Link
              to={normalizeAppPath(`/admin/documents/${link.documentId}`)}
              className="font-mono text-sm underline"
            >
              {link.documentId}
            </Link>
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd>
            <Badge variant={link.linkActive ? 'default' : 'secondary'}>
              {link.linkActive ? 'Active' : 'Inactive'}
            </Badge>
            {link.revokedAt ? (
              <span className="ml-2 text-sm text-muted-foreground">
                Revoked {new Date(link.revokedAt).toLocaleString()}
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Expires</dt>
          <dd className="font-mono text-sm">{new Date(link.linkExpiresAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Created</dt>
          <dd className="font-mono text-sm">{new Date(link.createdAt).toLocaleString()}</dd>
        </div>
      </dl>

      <h2 className="mb-4 text-lg font-semibold">Audit trail</h2>
      <DataTable
        columns={auditColumns}
        data={link.AuditLog}
        pageSize={25}
        emptyMessage="No audit events for this link"
      />
    </PageContainer>
  );
}
