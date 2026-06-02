/**
 * Admin document list with pagination and optional recipient filter.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import {
  AdminTableFilters,
  setOptionalQueryParam,
} from '@/components/layout/admin-table-filters';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { TablePagination } from '@/components/layout/table-pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { emptyAdminFilterValues, optionalSelectValue } from '@/lib/admin-filter-options';
import { apiFetch, parseProblem, problemMessage } from '@/lib/api';

const PAGE_SIZE = 50;

const FILTER_FIELDS = [
  {
    id: 'recipientEmail',
    label: 'Recipient email',
    type: 'email' as const,
    placeholder: 'filter@example.com',
  },
  {
    id: 'fileName',
    label: 'File name',
    type: 'text' as const,
    placeholder: 'report.pdf',
  },
];

const FILTER_IDS = FILTER_FIELDS.map((field) => field.id);

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
  const [filterInputs, setFilterInputs] = useState(() => emptyAdminFilterValues(FILTER_IDS));
  const [filters, setFilters] = useState<AppliedFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  function handleFilterChange(id: string, value: string) {
    setFilterInputs((current) => ({ ...current, [id]: value }));
  }

  function applyFilters() {
    setOffset(0);
    setFilters(parseAppliedFilters(filterInputs));
  }

  function clearFilters() {
    const empty = emptyAdminFilterValues(FILTER_IDS);
    setFilterInputs(empty);
    setOffset(0);
    setFilters({});
  }

  return (
    <div className="space-y-4">
      <AdminTableFilters
        fields={FILTER_FIELDS}
        values={filterInputs}
        onChange={handleFilterChange}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <TableLoadingSkeleton rows={2} />
      ) : rows.length === 0 ? (
        <EmptyState title="No documents match" />
      ) : (
        <PageContainer.TableFrame>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <span className="font-medium">{doc.fileName}</span>
                    <p className="font-mono text-xs text-muted-foreground">{doc.id}</p>
                  </TableCell>
                  <TableCell>{doc.recipientEmail}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatTs(doc.createdAt)}</TableCell>
                  <TableCell>
                    <DocumentStatusBadges
                      linkActive={doc.linkActive}
                      fileAvailable={doc.fileAvailable}
                      isUsed={doc.isUsed}
                      deletedAt={doc.deletedAt}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/admin/documents/${doc.id}`}>Detail</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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