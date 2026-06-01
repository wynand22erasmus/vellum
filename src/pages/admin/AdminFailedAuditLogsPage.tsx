/**
 * Admin view of audit events that failed to persist.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import {
  AdminTableFilters,
  setOptionalQueryParam,
} from '@/components/layout/admin-table-filters';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { PageSection } from '@/components/layout/page-section';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { TablePagination } from '@/components/layout/table-pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ADMIN_BOOLEAN_FILTER_OPTIONS,
  ADMIN_ISO_DATE_PLACEHOLDER,
  emptyAdminFilterValues,
  optionalBooleanQueryValue,
  optionalSelectValue,
} from '@/lib/admin-filter-options';
import { apiFetch } from '@/lib/api';

const PAGE_SIZE = 50;

const FILTER_FIELDS = [
  {
    id: 'error',
    label: 'Error',
    type: 'text' as const,
    placeholder: 'queue timeout',
  },
  {
    id: 'retried',
    label: 'Retried',
    type: 'select' as const,
    options: ADMIN_BOOLEAN_FILTER_OPTIONS,
  },
  {
    id: 'from',
    label: 'From (ISO)',
    type: 'text' as const,
    placeholder: ADMIN_ISO_DATE_PLACEHOLDER,
  },
  {
    id: 'to',
    label: 'To (ISO)',
    type: 'text' as const,
    placeholder: ADMIN_ISO_DATE_PLACEHOLDER,
  },
];

const FILTER_IDS = FILTER_FIELDS.map((field) => field.id);

type Row = {
  id: string;
  payload: unknown;
  error: string;
  createdAt: string;
  retried: boolean;
};

type ListResponse = {
  failedAuditLogs: Row[];
  total: number;
};

type AppliedFilters = {
  error?: string;
  retried?: string;
  from?: string;
  to?: string;
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

function parseAppliedFilters(values: Record<string, string>): AppliedFilters {
  return {
    error: optionalSelectValue(values.error ?? ''),
    retried: optionalBooleanQueryValue(values.retried ?? ''),
    from: optionalSelectValue(values.from ?? ''),
    to: optionalSelectValue(values.to ?? ''),
  };
}

/** Paginated failed audit log table with retry and date filters (`/admin/failed-audit-logs`). */
export function AdminFailedAuditLogsPage() {
  const [rows, setRows] = useState<Row[]>([]);
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
      setOptionalQueryParam(params, 'error', filters.error);
      setOptionalQueryParam(params, 'retried', filters.retried);
      setOptionalQueryParam(params, 'from', filters.from);
      setOptionalQueryParam(params, 'to', filters.to);

      const res = await apiFetch(`/api/admin/failed-audit-logs?${params.toString()}`);
      if (cancelled) return;
      if (res.status === 403) {
        setError('Admin access required.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Failed to load failed audit logs.');
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ListResponse;
      setRows(data.failedAuditLogs);
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
    <>
      <PageSection description="Payloads may contain sensitive data.">
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
          <EmptyState title="No failed audit rows match" />
        ) : (
          <PageContainer.TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead>Payload</TableHead>
                  <TableHead>Retried</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap">{formatTs(row.createdAt)}</TableCell>
                    <TableCell className="max-w-xs truncate text-xs">{row.error}</TableCell>
                    <TableCell>
                      <pre className="max-h-24 max-w-md overflow-auto rounded bg-muted p-2 text-xs">
                        {JSON.stringify(row.payload, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell>{row.retried ? 'Yes' : 'No'}</TableCell>
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
      </PageSection>
    </>
  );
}
