/**
 * Admin user list with column-header filters and sorting.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { setOptionalQueryParam } from '@/components/layout/admin-table-filters';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { TablePagination } from '@/components/layout/table-pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import {
  ADMIN_USER_KIND_OPTIONS,
  optionalSelectValue,
} from '@/lib/admin-filter-options';
import { apiFetch, parseProblem, problemMessage } from '@/lib/api';
import {
  booleanMultiSelectForQuery,
  multiSelectToQueryParam,
  parseMultiSelectFilterValue,
} from '@/lib/data-table-filter-value';

const PAGE_SIZE = 50;
const FILTER_DEBOUNCE_MS = 400;

const USER_KIND_FILTER_OPTIONS = ADMIN_USER_KIND_OPTIONS.filter((option) => option.value !== '');

type UserRow = {
  id: string;
  email: string;
  emailVerified: boolean;
  kind: string;
  firstName: string | null;
  lastName: string | null;
  lastSignInAt: string | null;
  createdAt: string;
};

type ListResponse = {
  users: UserRow[];
  total: number;
};

type AppliedFilters = {
  email?: string;
  kind?: string;
  emailVerified?: string;
};

const USER_COLUMNS: DataTableColumn<UserRow>[] = [
  {
    id: 'email',
    header: 'Email',
    dataType: 'email',
    accessorFn: (user) => user.email,
    cell: ({ value }) => <span className="font-medium">{String(value)}</span>,
  },
  {
    id: 'kind',
    header: 'Role',
    dataType: 'enum',
    enumOptions: USER_KIND_FILTER_OPTIONS,
    accessorFn: (user) => user.kind,
    cell: ({ value }) => <Badge variant="outline">{String(value)}</Badge>,
  },
  {
    id: 'emailVerified',
    header: 'Verified',
    dataType: 'boolean',
    accessorFn: (user) => String(user.emailVerified),
    cell: ({ row }) => (row.emailVerified ? 'Yes' : 'No'),
  },
  {
    id: 'firstName',
    header: 'First name',
    dataType: 'text',
    accessorFn: (user) => user.firstName ?? '',
    cell: ({ value }) => String(value) || '—',
  },
  {
    id: 'lastName',
    header: 'Last name',
    dataType: 'text',
    accessorFn: (user) => user.lastName ?? '',
    cell: ({ value }) => String(value) || '—',
  },
  {
    id: 'lastSignInAt',
    header: 'Last sign-in',
    dataType: 'datetime',
    accessorFn: (user) => user.lastSignInAt ?? '',
    className: 'whitespace-nowrap',
    cell: ({ value }) => (value ? formatTs(String(value)) : '—'),
  },
  {
    id: 'createdAt',
    header: 'Created',
    dataType: 'datetime',
    accessorFn: (user) => user.createdAt,
    className: 'whitespace-nowrap',
    cell: ({ value }) => formatTs(String(value)),
  },
];

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

function parseAppliedFilters(values: Record<string, string>): AppliedFilters {
  const kindSelected = parseMultiSelectFilterValue(values.kind ?? '');
  const verified = booleanMultiSelectForQuery(
    parseMultiSelectFilterValue(values.emailVerified ?? ''),
  );

  return {
    email: optionalSelectValue(values.email ?? ''),
    kind: multiSelectToQueryParam(kindSelected),
    emailVerified: verified === undefined ? undefined : String(verified),
  };
}

/** Paginated user table with column filters (`/admin/users`). */
export function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
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
      setOptionalQueryParam(params, 'email', filters.email);
      setOptionalQueryParam(params, 'kind', filters.kind);
      setOptionalQueryParam(params, 'emailVerified', filters.emailVerified);

      const res = await apiFetch(`/api/admin/users?${params.toString()}`);
      if (cancelled) return;
      if (!res.ok) {
        const problem = await parseProblem(res);
        setError(problemMessage(problem));
        setLoading(false);
        return;
      }
      const data = (await res.json()) as ListResponse;
      setRows(data.users);
      setTotal(data.total);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [offset, filters]);

  return (
    <div className="space-y-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <TableLoadingSkeleton rows={2} />
      ) : rows.length === 0 &&
        !filters.email &&
        !filters.kind &&
        !filters.emailVerified ? (
        <EmptyState title="No users" />
      ) : (
        <PageContainer.TableFrame>
          <DataTable
            data={rows}
            columns={USER_COLUMNS}
            getRowKey={(user) => user.id}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            manualFiltering
            manualSorting
            emptyMessage="No users match"
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
