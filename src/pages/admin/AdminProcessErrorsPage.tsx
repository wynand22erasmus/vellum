/**
 * Admin view of operational process errors (RFC 9457 pipeline).
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
import { apiFetch, parseProblem, problemMessage } from '@/lib/api';

const PAGE_SIZE = 50;

const FILTER_FIELDS = [
  { id: 'source', label: 'Source', type: 'text' as const, placeholder: 'http' },
  { id: 'status', label: 'Status', type: 'text' as const, placeholder: '500' },
  {
    id: 'hasOrphans',
    label: 'Has orphans',
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
  problemType: string;
  title: string;
  status: number;
  detail: string;
  source: string;
  requestId: string | null;
  failedAuditLogId: string | null;
  auditLogId: string | null;
  correlationId: string | null;
  reconciledAt: string | null;
  reconcileAttempts: number;
  createdAt: string;
  extensions: unknown;
};

type ListResponse = {
  processErrors: Row[];
  total: number;
};

type AppliedFilters = {
  source?: string;
  status?: string;
  hasOrphans?: string;
  from?: string;
  to?: string;
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

function parseAppliedFilters(values: Record<string, string>): AppliedFilters {
  return {
    source: optionalSelectValue(values.source ?? ''),
    status: optionalSelectValue(values.status ?? ''),
    hasOrphans: optionalBooleanQueryValue(values.hasOrphans ?? ''),
    from: optionalSelectValue(values.from ?? ''),
    to: optionalSelectValue(values.to ?? ''),
  };
}

/** Paginated process error table (`/admin/process-errors`). */
export function AdminProcessErrorsPage() {
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
      setOptionalQueryParam(params, 'source', filters.source);
      setOptionalQueryParam(params, 'status', filters.status);
      setOptionalQueryParam(params, 'hasOrphans', filters.hasOrphans);
      setOptionalQueryParam(params, 'from', filters.from);
      setOptionalQueryParam(params, 'to', filters.to);

      const res = await apiFetch(`/api/admin/process-errors?${params.toString()}`);
      if (cancelled) return;
      if (!res.ok) {
        const problem = await parseProblem(res);
        setError(problemMessage(problem));
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ListResponse;
      setRows(data.processErrors);
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
      <PageSection description="RFC 9457 operational failures from HTTP, workers, and queues.">
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
          <EmptyState title="No process errors match" />
        ) : (
          <PageContainer.TableFrame>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Detail</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Reconciled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="whitespace-nowrap">{formatTs(row.createdAt)}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell className="text-xs">{row.source}</TableCell>
                    <TableCell className="max-w-md truncate text-xs">{row.detail}</TableCell>
                    <TableCell className="max-w-xs truncate font-mono text-xs">
                      {[row.correlationId, row.failedAuditLogId, row.auditLogId]
                        .filter(Boolean)
                        .join(' · ') || '—'}
                    </TableCell>
                    <TableCell>{row.reconciledAt ? 'Yes' : 'No'}</TableCell>
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
