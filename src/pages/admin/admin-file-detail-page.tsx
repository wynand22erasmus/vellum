/**
 * Admin file detail with linked document envelope rows.
 *
 * @packageDocumentation
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Link, useParams } from '@tanstack/react-router';
import { FileSha256Display } from '@/components/features/file-sha256-display';
import { PAGE_LABELS } from '@/lib/page-labels';
import { dbColumn, disableColumnInteractions } from '@/components/data-table/column-helpers';
import { DataTable } from '@/components/data-table/data-table';
import { PageContainer } from '@/components/layout/page-container';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeAppPath } from '@/lib/sidebar-nav';
import { type FileDocumentSummary, useAdminFileQuery } from '@/lib/queries/admin';

/** Admin file detail at `/admin/files/:id`. */
export function AdminFileDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: file, isLoading, error } = useAdminFileQuery(id);

  const documentColumns = useMemo<ColumnDef<FileDocumentSummary>[]>(
    () => [
      dbColumn<FileDocumentSummary>('Recipient', 'email', 'Recipient', {
        accessorKey: 'recipientEmail',
      }),
      dbColumn<FileDocumentSummary>('Document', 'createdAt', 'Created'),
      dbColumn<FileDocumentSummary>('Document', 'downloadCount', 'Downloads', {
        cell: ({ row }) => `${row.original.downloadCount}/${row.original.maxDownloads}`,
      }),
      disableColumnInteractions<FileDocumentSummary>({
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

  if (error || !file) {
    return (
      <PageContainer variant="wide">
        <Alert variant="destructive">
          <AlertDescription>{error?.message ?? 'File not found'}</AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={file.fileName}
      description={PAGE_LABELS.adminFileDetail.description}
      variant="wide"
    >
      <div className="mb-6 space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">Storage:</span>{' '}
          {file.storageAttached ? 'Attached' : 'None'}
          {' · '}
          <span className="text-muted-foreground">Available:</span> {file.fileAvailable ? 'Yes' : 'No'}
          {' · '}
          <span className="text-muted-foreground">Documents:</span> {file.documentCount}
        </p>
        <FileSha256Display sha256={file.sha256} />
        <p className="text-muted-foreground">
          File expires {new Date(file.fileExpiresAt).toLocaleString()} · Record expires{' '}
          {new Date(file.recordExpiresAt).toLocaleString()}
          {file.deletedAt ? ` · Deleted ${new Date(file.deletedAt).toLocaleString()}` : null}
        </p>
      </div>

      <h2 className="mb-3 text-lg font-medium">Document envelopes</h2>
      <DataTable
        columns={documentColumns}
        data={file.Document}
        emptyMessage="No document envelopes for this file"
      />
    </PageContainer>
  );
}
