/**
 * Admin document file detail with linked recipient rows.
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
import { useAdminDocumentFileQuery } from '@/lib/queries/admin';

type UserLinkRow = {
  id: string;
  recipientEmail: string;
  linkExpiresAt: string;
  isUsed: boolean;
  maxDownloads: number;
  downloadCount: number;
  revokedAt: string | null;
  createdAt: string;
};

/** Admin document file detail at `/admin/document-files/:id`. */
export function AdminDocumentFileDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: file, isLoading, error } = useAdminDocumentFileQuery(id);

  const linkColumns = useMemo<ColumnDef<UserLinkRow>[]>(
    () => [
      dbColumn<UserLinkRow>('DocumentUserLink', 'recipientEmail', 'Recipient'),
      dbColumn<UserLinkRow>('DocumentUserLink', 'createdAt', 'Created'),
      dbColumn<UserLinkRow>('DocumentUserLink', 'linkExpiresAt', 'Link expires'),
      dbColumn<UserLinkRow>('DocumentUserLink', 'downloadCount', 'Downloads'),
      dbColumn<UserLinkRow>('DocumentUserLink', 'isUsed', 'Used', {
        cell: ({ getValue }) => (getValue() ? 'Yes' : 'No'),
      }),
      disableColumnInteractions<UserLinkRow>({
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button variant="outline" size="sm" asChild>
            <Link to={normalizeAppPath(`/admin/documents/${row.original.id}`)}>Detail</Link>
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
          <AlertDescription>{error?.message ?? 'Document file not found'}</AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={file.fileName}
      description={PAGE_LABELS.adminDocumentFileDetail.description}
      variant="wide"
    >
      <div className="mb-6 space-y-2 text-sm">
        <p>
          <span className="text-muted-foreground">Storage:</span>{' '}
          {file.storageAttached ? 'Attached' : 'None'}
          {' · '}
          <span className="text-muted-foreground">Available:</span> {file.fileAvailable ? 'Yes' : 'No'}
          {' · '}
          <span className="text-muted-foreground">Links:</span> {file.linkCount}
        </p>
        <FileSha256Display sha256={file.sha256} />
        <p className="text-muted-foreground">
          File expires {new Date(file.fileExpiresAt).toLocaleString()} · Record expires{' '}
          {new Date(file.recordExpiresAt).toLocaleString()}
          {file.deletedAt ? ` · Deleted ${new Date(file.deletedAt).toLocaleString()}` : null}
        </p>
      </div>

      <h2 className="mb-3 text-lg font-medium">Recipient links</h2>
      <DataTable
        columns={linkColumns}
        data={file.userLinks}
        emptyMessage="No recipient links for this file"
      />
    </PageContainer>
  );
}
