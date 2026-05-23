import { useEffect, useState } from 'react';
import {
  AdminTableFilters,
  setOptionalQueryParam,
} from '@/components/layout/admin-table-filters';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { TablePagination } from '@/components/layout/table-pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
  ADMIN_USER_KIND_OPTIONS,
  emptyAdminFilterValues,
  optionalBooleanQueryValue,
  optionalSelectValue,
} from '@/lib/admin-filter-options';
import { apiFetch } from '@/lib/api';

const PAGE_SIZE = 50;

const FILTER_FIELDS = [
  {
    id: 'email',
    label: 'Email',
    type: 'text' as const,
    placeholder: 'user@example.com',
  },
  {
    id: 'kind',
    label: 'Role',
    type: 'select' as const,
    options: ADMIN_USER_KIND_OPTIONS,
  },
  {
    id: 'emailVerified',
    label: 'Verified',
    type: 'select' as const,
    options: ADMIN_BOOLEAN_FILTER_OPTIONS,
  },
];

const FILTER_IDS = FILTER_FIELDS.map((field) => field.id);

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

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

function parseAppliedFilters(values: Record<string, string>): AppliedFilters {
  return {
    email: optionalSelectValue(values.email ?? ''),
    kind: optionalSelectValue(values.kind ?? ''),
    emailVerified: optionalBooleanQueryValue(values.emailVerified ?? ''),
  };
}

export function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
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
      setOptionalQueryParam(params, 'email', filters.email);
      setOptionalQueryParam(params, 'kind', filters.kind);
      setOptionalQueryParam(params, 'emailVerified', filters.emailVerified);

      const res = await apiFetch(`/api/admin/users?${params.toString()}`);
      if (cancelled) return;
      if (res.status === 403) {
        setError('Admin access required.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Failed to load users.');
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
        <EmptyState title="No users match" />
      ) : (
        <PageContainer.TableFrame>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Last sign-in</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.kind}</Badge>
                  </TableCell>
                  <TableCell>{user.emailVerified ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.lastSignInAt ? formatTs(user.lastSignInAt) : '—'}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatTs(user.createdAt)}</TableCell>
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
