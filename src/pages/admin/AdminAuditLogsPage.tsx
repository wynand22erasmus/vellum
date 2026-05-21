/**
 * Admin audit log list with optional filters.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Label } from '../../components/ui/label.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card.tsx';
import { apiFetch } from '../../lib/api.ts';

const PAGE_SIZE = 50;

const EVENT_TYPES = [
  '',
  'USER_LOGIN',
  'EMAIL_INITIAL_SENT',
  'EMAIL_REGENERATE_SENT',
  'FILE_DOWNLOAD_SUCCESS',
  'FILE_DOWNLOAD_FAILED',
  'FILE_SCRUBBED',
] as const;

type AuditRow = {
  id: string;
  eventType: string;
  timestamp: string;
  userId: string | null;
  documentId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: unknown;
  expiresAt: string;
};

type ListResponse = {
  auditLogs: AuditRow[];
  total: number;
  limit: number;
  offset: number;
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

/** Filterable audit log table (`/admin/audit-logs`). */
export function AdminAuditLogsPage() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [eventTypeInput, setEventTypeInput] = useState('');
  const [documentIdInput, setDocumentIdInput] = useState('');
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');

  const [eventType, setEventType] = useState<string | undefined>(undefined);
  const [documentId, setDocumentId] = useState<string | undefined>(undefined);
  const [from, setFrom] = useState<string | undefined>(undefined);
  const [to, setTo] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
      });
      if (eventType) {
        params.set('eventType', eventType);
      }
      if (documentId) {
        params.set('documentId', documentId);
      }
      if (from) {
        params.set('from', from);
      }
      if (to) {
        params.set('to', to);
      }
      const res = await apiFetch(`/api/admin/audit-logs?${params.toString()}`);
      if (cancelled) {
        return;
      }
      if (res.status === 401) {
        window.location.href = `/login?returnTo=${encodeURIComponent('/admin/audit-logs')}`;
        return;
      }
      if (res.status === 403) {
        setError('Admin access required.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Failed to load audit logs.');
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
  }, [offset, eventType, documentId, from, to]);

  function applyFilters() {
    const et = eventTypeInput.trim();
    const did = documentIdInput.trim();
    const f = fromInput.trim();
    const t = toInput.trim();
    setOffset(0);
    setEventType(et.length > 0 ? et : undefined);
    setDocumentId(did.length > 0 ? did : undefined);
    setFrom(f.length > 0 ? f : undefined);
    setTo(t.length > 0 ? t : undefined);
  }

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit logs</CardTitle>
        <CardDescription>
          Global audit events. Use ISO date strings for from/to (e.g. 2025-01-01 or full ISO
          datetime).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="audit-event">Event type</Label>
            <select
              id="audit-event"
              className="flex h-9 w-full rounded-md border border-border bg-background px-2 text-sm"
              value={eventTypeInput}
              onChange={(e) => setEventTypeInput(e.target.value)}
            >
              {EVENT_TYPES.map((v) => (
                <option key={v || 'any'} value={v}>
                  {v || '(any)'}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="audit-doc">Document id</Label>
            <Input
              id="audit-doc"
              value={documentIdInput}
              onChange={(e) => setDocumentIdInput(e.target.value)}
              placeholder="uuid"
              className="font-mono text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="audit-from">From</Label>
            <Input
              id="audit-from"
              type="text"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              placeholder="2025-01-01"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="audit-to">To</Label>
            <Input
              id="audit-to"
              type="text"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              placeholder="2025-12-31"
            />
          </div>
        </div>
        <Button type="button" onClick={() => void applyFilters()}>
          Apply filters
        </Button>

        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {error && <p className="text-sm text-error">{error}</p>}

        {!loading && rows.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Time
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Event
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    Document
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    User
                  </th>
                  <th className="border-b border-border px-2 py-2 font-medium">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((log) => (
                  <tr key={log.id} className="odd:bg-background">
                    <td className="border-b border-border px-2 py-2 whitespace-nowrap">
                      {formatTs(log.timestamp)}
                    </td>
                    <td className="border-b border-border px-2 py-2">
                      {log.eventType}
                    </td>
                    <td className="border-b border-border px-2 py-2 font-mono text-xs">
                      {log.documentId ? (
                        <Link
                          to={`/admin/documents/${log.documentId}`}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          {log.documentId.slice(0, 8)}…
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="border-b border-border px-2 py-2 font-mono text-xs">
                      {log.userId ?? '—'}
                    </td>
                    <td className="border-b border-border px-2 py-2 text-xs">
                      {log.ipAddress ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {!loading && rows.length === 0 && !error ? (
          <p className="text-sm text-muted-foreground">No audit logs match.</p>
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
