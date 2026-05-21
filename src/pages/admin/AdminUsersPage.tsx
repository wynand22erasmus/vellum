/**
 * Admin user list (read-only).
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card.tsx';
import { apiFetch } from '../../lib/api.ts';

const PAGE_SIZE = 50;

type UserRow = {
  id: string;
  email: string;
  emailVerified: boolean;
  kind: string;
  firstName: string | null;
  lastName: string | null;
  lastSignInAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ListResponse = {
  users: UserRow[];
  total: number;
  limit: number;
  offset: number;
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

/** Paginated users table (`/admin/users`). */
export function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
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
      const res = await apiFetch(`/api/admin/users?${params.toString()}`);
      if (cancelled) {
        return;
      }
      if (res.status === 401) {
        window.location.href = `/login?returnTo=${encodeURIComponent('/admin/users')}`;
        return;
      }
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
  }, [offset]);

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>{total} dashboard accounts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-error">{error}</p>}

        {!loading && rows.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Email
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Role
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Verified
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Last sign-in
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((u) => (
                  <tr key={u.id} className="odd:bg-background">
                    <td className="border-b border-border px-2 py-2">
                      <span className="font-medium">{u.email}</span>
                      <p className="font-mono text-xs text-muted-foreground">
                        {u.id}
                      </p>
                    </td>
                    <td className="border-b border-border px-2 py-2">{u.kind}</td>
                    <td className="border-b border-border px-2 py-2">
                      {u.emailVerified ? 'yes' : 'no'}
                    </td>
                    <td className="border-b border-border px-2 py-2 whitespace-nowrap">
                      {u.lastSignInAt ? formatTs(u.lastSignInAt) : '—'}
                    </td>
                    <td className="border-b border-border px-2 py-2 whitespace-nowrap">
                      {formatTs(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading && rows.length === 0 && !error ? (
          <p className="text-sm text-muted-foreground">No users.</p>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            Showing {total === 0 ? 0 : offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canPrev || loading}
              onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canNext || loading}
              onClick={() => setOffset((o) => o + PAGE_SIZE)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
