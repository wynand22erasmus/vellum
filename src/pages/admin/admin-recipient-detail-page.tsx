/**
 * Admin recipient detail with linked document envelopes.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from '@tanstack/react-router';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { type Document, useAdminRecipientQuery } from '@/lib/queries/admin';

/** Admin recipient detail at `/admin/recipients/:id`. */
export function AdminRecipientDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: recipient, isLoading, error } = useAdminRecipientQuery(id);

  const documentColumns = useMemo<ColumnDef<Document>[]>(
    () => [
      dbColumn<Document>('File', 'fileName', 'File'),
      dbColumn<Document>('Document', 'createdAt', 'Created'),
      dbColumn<Document>('Document', 'status', 'Status', {
        cell: ({ row }) => (
          <DocumentStatusBadges
            linkActive={row.original.linkActive}
            fileAvailable={row.original.fileAvailable}
            maxDownloads={row.original.maxDownloads}
            downloadCount={row.original.downloadCount}
            downloadsRemaining={row.original.downloadsRemaining}
          />
        ),
      }),
      disableColumnInteractions<Document>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/documents/${row.original.documentId}`)}>Detail</Link>
          </Button>
        ),
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

  if (error || !recipient) {
    return (
      <PageContainer variant="wide">
        <Alert variant="destructive">
          <AlertDescription>{error?.message ?? 'Recipient not found'}</AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={recipient.email}
      description={PAGE_LABELS.adminRecipientDetail.description}
      variant="wide"
      actions={
        <Button variant="outline" size="sm" asChild>
          <Link to={normalizeAppPath('/admin/recipients')}>Back to list</Link>
        </Button>
      }
    >
      <dl className="mb-8 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-muted-foreground">Source key</dt>
          <dd className="font-mono text-sm">{recipient.sourceSystemKey}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Phone</dt>
          <dd>{recipient.phoneNumber ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">OTP channel</dt>
          <dd>
            {recipient.otpChannel ? (
              <Badge variant="secondary">{recipient.otpChannel}</Badge>
            ) : (
              '—'
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Documents</dt>
          <dd>{recipient.documentCount}</dd>
        </div>
      </dl>

      <h2 className="mb-4 text-lg font-semibold">Document envelopes</h2>
      <DataTable
        columns={documentColumns}
        data={recipient.Document}
        pageSize={25}
        emptyMessage="No documents for this recipient"
      />
    </PageContainer>
  );
}
