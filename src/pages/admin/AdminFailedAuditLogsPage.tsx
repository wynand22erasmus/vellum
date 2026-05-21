/**
 * Admin failed audit log list (read-only).
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
  limit: number;
  offset: number;
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

/** Paginated failed audit dead-letter table (`/admin/failed-audit-logs`). */
export function AdminFailedAuditLogsPage() {
  const [rows, setRows] = useState<Row[]>([]);
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
      const res = await apiFetch(`/api/admin/failed-audit-logs?${params.toString()}`);
      if (cancelled) {
        return;
      }
      if (res.status === 401) {
        window.location.href = `/login?returnTo=${encodeURIComponent('/admin/failed-audit-logs')}`;
        return;
      }
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
  }, [offset]);

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Failed audit logs</CardTitle>
        <CardDescription>
          Rows written when enqueueing an audit event failed. Payloads may contain sensitive data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-error">{error}</p>}

        {!loading && rows.length > 0 ? (
          <ul className="space-y-4">
            {rows.map((r) => (
              <li
                key={r.id}
                className="rounded-md border border-border p-3 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{r.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTs(r.createdAt)} · retried: {r.retried ? 'yes' : 'no'}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-error">{r.error}</p>
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-muted p-2 text-xs whitespace-pre-wrap break-all">
                  {JSON.stringify(r.payload, null, 2)}
                </pre>
              </li>
            ))}
          </ul>
        ) : null}

        {!loading && rows.length === 0 && !error ? (
          <p className="text-sm text-muted-foreground">No failed audit rows.</p>
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
