/**
 * Admin audit log browser with event and date range filters.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AdminTableFilters,
  setOptionalQueryParam,
} from '@/components/layout/admin-table-filters';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
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
import { ADMIN_AUDIT_EVENT_TYPE_OPTIONS } from '@/lib/admin-audit-event-types';
import { ADMIN_ISO_DATE_PLACEHOLDER, emptyAdminFilterValues, optionalSelectValue } from '@/lib/admin-filter-options';
import { apiFetch, parseProblem, problemMessage } from '@/lib/api';

const PAGE_SIZE = 50;

const FILTER_FIELDS = [
  {
    id: 'eventType',
    label: 'Event type',
    type: 'select' as const,
    options: ADMIN_AUDIT_EVENT_TYPE_OPTIONS,
  },
  {
    id: 'documentId',
    label: 'Document ID',
    type: 'text' as const,
    placeholder: 'uuid',
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

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

function parseAppliedFilters(values: Record<string, string>): AppliedFilters {
  return {
    eventType: optionalSelectValue(values.eventType ?? ''),
    documentId: optionalSelectValue(values.documentId ?? ''),
    from: optionalSelectValue(values.from ?? ''),
    to: optionalSelectValue(values.to ?? ''),
  };
}

/** Paginated audit log table with event type and date filters (`/admin/audit-logs`). */
export function AdminAuditLogsPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
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
        <EmptyState title="No audit events match" />
      ) : (
        <PageContainer.TableFrame>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap">{formatTs(row.timestamp)}</TableCell>
                  <TableCell>{row.eventType}</TableCell>
                  <TableCell>
                    {row.documentId ? (
                      <Link
                        to={`/admin/documents/${row.documentId}`}
                        className="font-mono text-xs text-primary underline-offset-2 hover:underline"
                      >
                        {row.documentId.slice(0, 8)}…
                      </Link>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.userId ?? '—'}</TableCell>
                  <TableCell className="text-xs">{row.ipAddress ?? '—'}</TableCell>
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
