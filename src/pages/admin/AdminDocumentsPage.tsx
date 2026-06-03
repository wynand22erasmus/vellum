/**
 * Admin document list with pagination and column-header filters.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { setOptionalQueryParam } from '@/components/layout/admin-table-filters';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { TablePagination } from '@/components/layout/table-pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { optionalSelectValue } from '@/lib/admin-filter-options';
import { apiFetch, parseProblem, problemMessage } from '@/lib/api';
import {
  DOCUMENT_STATUS_FILTER_OPTIONS,
  documentStatusFilterTags,
} from '@/lib/document-status-filter-options';

const PAGE_SIZE = 50;
const FILTER_DEBOUNCE_MS = 400;

const CLIENT_FILTER_COLUMN_IDS = ['createdAt', 'status'] as const;
const CLIENT_SORT_COLUMN_IDS = [
  'fileName',
  'recipientEmail',
  'createdAt',
  'status',
  'linkActive',
  'fileAvailable',
  'isUsed',
  'deleted',
] as const;

type DocumentRow = {
  id: string;
  fileName: string;
  recipientEmail: string;
  createdAt: string;
  isUsed: boolean;
  deletedAt: string | null;
  linkActive: boolean;
  fileAvailable: boolean;
};

type ListResponse = {
  documents: DocumentRow[];
  total: number;
};

type AppliedFilters = {
  recipientEmail?: string;
  fileName?: string;
};

const DOCUMENT_COLUMNS: DataTableColumn<DocumentRow>[] = [
  {
    id: 'fileName',
    header: 'File',
    dataType: 'text',
    accessorFn: (doc) => doc.fileName,
    filter: { type: 'text', placeholder: 'report.pdf' },
    cell: ({ row }) => <span className="font-medium">{row.fileName}</span>,
  },
  {
    id: 'id',
    header: 'ID',
    dataType: 'text',
    accessorFn: (doc) => doc.id,
    className: 'font-mono text-xs text-muted-foreground',
  },
  {
    id: 'recipientEmail',
    header: 'Recipient',
    dataType: 'email',
    accessorFn: (doc) => doc.recipientEmail,
  },
  {
    id: 'createdAt',
    header: 'Created',
    dataType: 'datetime',
    accessorFn: (doc) => doc.createdAt,
    className: 'whitespace-nowrap',
    cell: ({ value }) => formatTs(String(value)),
  },
  {
    id: 'linkActive',
    header: 'Link',
    dataType: 'boolean',
    accessorFn: (doc) => String(doc.linkActive),
    cell: ({ row }) => (row.linkActive ? 'Active' : 'Expired'),
  },
  {
    id: 'fileAvailable',
    header: 'File state',
    dataType: 'boolean',
    accessorFn: (doc) => String(doc.fileAvailable),
    cell: ({ row }) => (row.fileAvailable ? 'Available' : 'Scrubbed'),
  },
  {
    id: 'isUsed',
    header: 'Downloaded',
    dataType: 'boolean',
    accessorFn: (doc) => String(doc.isUsed),
    cell: ({ row }) => (row.isUsed ? 'Yes' : 'No'),
  },
  {
    id: 'deleted',
    header: 'Deleted',
    dataType: 'boolean',
    accessorFn: (doc) => String(Boolean(doc.deletedAt)),
    cell: ({ row }) => (row.deletedAt ? 'Yes' : 'No'),
  },
  {
    id: 'status',
    header: 'Status',
    dataType: 'enum',
    enumOptions: DOCUMENT_STATUS_FILTER_OPTIONS,
    accessorFn: (doc) => documentStatusFilterTags(doc),
    sortable: false,
    cell: ({ row }) => (
      <DocumentStatusBadges
        linkActive={row.linkActive}
        fileAvailable={row.fileAvailable}
        isUsed={row.isUsed}
        deletedAt={row.deletedAt}
      />
    ),
  },
  {
    id: 'actions',
    header: '',
    accessorFn: (doc) => doc.id,
    enableSorting: false,
    enableFiltering: false,
    className: 'text-right',
    headerClassName: 'text-right',
    cell: ({ row }) => (
      <Button variant="outline" size="sm" asChild>
        <Link to={`/admin/documents/${row.id}`}>Detail</Link>
      </Button>
    ),
  },
];

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

function parseAppliedFilters(values: Record<string, string>): AppliedFilters {
  return {
    recipientEmail: optionalSelectValue(values.recipientEmail ?? ''),
    fileName: optionalSelectValue(values.fileName ?? ''),
  };
}

/** Paginated document table with recipient and file name filters (`/admin/documents`). */
export function AdminDocumentsPage() {
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const debouncedColumnFilters = useDebouncedValue(columnFilters, FILTER_DEBOUNCE_MS);
  const [filters, setFilters] = useState<AppliedFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setOffset(0);
    setFilters(parseAppliedFilters(debouncedColumnFilters));
  }, [debouncedColumnFilters]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      });
      setOptionalQueryParam(params, 'recipientEmail', filters.recipientEmail);
      setOptionalQueryParam(params, 'fileName', filters.fileName);

      const res = await apiFetch(`/api/admin/documents?${params.toString()}`);
      if (cancelled) return;
      if (!res.ok) {
        const problem = await parseProblem(res);
        setError(problemMessage(problem));
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ListResponse;
      setRows(data.documents);
      setTotal(data.total);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [offset, filters]);

  const hasServerFilters = Boolean(filters.recipientEmail || filters.fileName);

  return (
    <div className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <TableLoadingSkeleton rows={2} />
      ) : rows.length === 0 && !hasServerFilters ? (
        <EmptyState title="No documents" />
      ) : (
        <PageContainer.TableFrame>
          <DataTable
            data={rows}
            columns={DOCUMENT_COLUMNS}
            getRowKey={(doc) => doc.id}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            manualFiltering
            manualSorting
            clientFilterColumnIds={CLIENT_FILTER_COLUMN_IDS}
            clientSortColumnIds={CLIENT_SORT_COLUMN_IDS}
            emptyMessage="No documents match"
          />
        </PageContainer.TableFrame>
      )}

      <TablePagination
        offset={offset}
        pageSize={PAGE_SIZE}
        total={total}
        loading={loading}
        onPrevious={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
        onNext={() => setOffset((o) => o + PAGE_SIZE)}
      />
    </div>
  );
}
