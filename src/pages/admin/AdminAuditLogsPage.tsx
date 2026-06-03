/**
 * Admin audit log browser with column-header filters and sorting.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { setOptionalQueryParam } from '@/components/layout/admin-table-filters';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { TablePagination } from '@/components/layout/table-pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { ADMIN_AUDIT_EVENT_TYPE_OPTIONS } from '@/lib/admin-audit-event-types';
import { optionalSelectValue } from '@/lib/admin-filter-options';
import { apiFetch, parseProblem, problemMessage } from '@/lib/api';
import {
  multiSelectToQueryParam,
  parseMultiSelectFilterValue,
} from '@/lib/data-table-filter-value';

const PAGE_SIZE = 50;
const FILTER_DEBOUNCE_MS = 400;

const AUDIT_EVENT_FILTER_OPTIONS = ADMIN_AUDIT_EVENT_TYPE_OPTIONS.filter(
  (option) => option.value !== '',
);

type AuditRow = {
  id: string;
  eventType: string;
  timestamp: string;
  userId: string | null;
  documentId: string | null;
  ipAddress: string | null;
};

type ListResponse = {
  auditLogs: AuditRow[];
  total: number;
};

type AppliedFilters = {
  eventType?: string;
  documentId?: string;
  from?: string;
  to?: string;
};

const AUDIT_COLUMNS: DataTableColumn<AuditRow>[] = [
  {
    id: 'timestamp',
    header: 'Time',
    dataType: 'datetime',
    accessorFn: (row) => row.timestamp,
    className: 'whitespace-nowrap',
    cell: ({ value }) => formatTs(String(value)),
  },
  {
    id: 'from',
    header: 'From',
    dataType: 'datetime',
    filterOnly: true,
    accessorFn: () => '',
    enableSorting: false,
  },
  {
    id: 'to',
    header: 'To',
    dataType: 'datetime',
    filterOnly: true,
    accessorFn: () => '',
    enableSorting: false,
  },
  {
    id: 'eventType',
    header: 'Event',
    dataType: 'enum',
    enumOptions: AUDIT_EVENT_FILTER_OPTIONS,
    accessorFn: (row) => row.eventType,
  },
  {
    id: 'documentId',
    header: 'Document',
    dataType: 'text',
    accessorFn: (row) => row.documentId ?? '',
    cell: ({ row }) =>
      row.documentId ? (
        <Link
          to={`/admin/documents/${row.documentId}`}
          className="font-mono text-xs text-primary underline-offset-2 hover:underline"
        >
          {row.documentId.slice(0, 8)}…
        </Link>
      ) : (
        '—'
      ),
  },
  {
    id: 'userId',
    header: 'User',
    dataType: 'text',
    accessorFn: (row) => row.userId ?? '',
    className: 'font-mono text-xs',
    cell: ({ value }) => String(value) || '—',
  },
  {
    id: 'ipAddress',
    header: 'IP',
    dataType: 'text',
    accessorFn: (row) => row.ipAddress ?? '',
    className: 'text-xs',
    cell: ({ value }) => String(value) || '—',
  },
];

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

function parseAppliedFilters(values: Record<string, string>): AppliedFilters {
  const eventTypes = parseMultiSelectFilterValue(values.eventType ?? '');

  return {
    eventType: multiSelectToQueryParam(eventTypes),
    documentId: optionalSelectValue(values.documentId ?? ''),
    from: optionalSelectValue(values.from ?? ''),
    to: optionalSelectValue(values.to ?? ''),
  };
}

/** Paginated audit log table with column filters (`/admin/audit-logs`). */
export function AdminAuditLogsPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
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
      setOptionalQueryParam(params, 'eventType', filters.eventType);
      setOptionalQueryParam(params, 'documentId', filters.documentId);
      setOptionalQueryParam(params, 'from', filters.from);
      setOptionalQueryParam(params, 'to', filters.to);

      const res = await apiFetch(`/api/admin/audit-logs?${params.toString()}`);
      if (cancelled) return;
      if (!res.ok) {
        const problem = await parseProblem(res);
        setError(problemMessage(problem));
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ListResponse;
      setRows(data.auditLogs);
      setTotal(data.total);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [offset, filters]);

  const hasFilters = Boolean(
    filters.eventType || filters.documentId || filters.from || filters.to,
  );

  return (
    <div className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <TableLoadingSkeleton rows={2} />
      ) : rows.length === 0 && !hasFilters ? (
        <EmptyState title="No audit events" />
      ) : (
        <PageContainer.TableFrame>
          <DataTable
            data={rows}
            columns={AUDIT_COLUMNS}
            getRowKey={(row) => row.id}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            manualFiltering
            manualSorting
            emptyMessage="No audit events match"
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
