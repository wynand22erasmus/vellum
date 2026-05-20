/**
 * Admin document list with pagination and optional recipient filter.
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

type DocumentRow = {
  id: string;
  fileName: string;
  recipientEmail: string;
  linkExpiresAt: string;
  fileExpiresAt: string;
  recordExpiresAt: string;
  isUsed: boolean;
  deletedAt: string | null;
  createdAt: string;
  storageAttached: boolean;
  linkActive: boolean;
  fileAvailable: boolean;
};

type ListResponse = {
  documents: DocumentRow[];
  total: number;
  limit: number;
  offset: number;
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

/** Paginated document table (`/admin/documents`). */
export function AdminDocumentsPage() {
  const [rows, setRows] = useState<DocumentRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [filterInput, setFilterInput] = useState('');
  const [recipientEmail, setRecipientEmail] = useState<string | undefined>(undefined);
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
      if (recipientEmail) {
        params.set('recipientEmail', recipientEmail);
      }
      const res = await apiFetch(`/api/admin/documents?${params.toString()}`);
      if (cancelled) {
        return;
      }
      if (res.status === 401) {
        window.location.href = `/login?returnTo=${encodeURIComponent('/admin/documents')}`;
        return;
      }
      if (res.status === 403) {
        setError('Admin access required.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Failed to load documents.');
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
  }, [offset, recipientEmail]);

  function applyFilter() {
    const trimmed = filterInput.trim();
    setOffset(0);
    setRecipientEmail(trimmed.length > 0 ? trimmed : undefined);
  }

  const canPrev = offset > 0;
  const canNext = offset + PAGE_SIZE < total;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            {total} total{recipientEmail ? ` (filtered by recipient)` : ''}. Pagination:{' '}
            {PAGE_SIZE} per page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1">
              <Label htmlFor="admin-doc-recipient">Recipient email (optional)</Label>
              <Input
                id="admin-doc-recipient"
                type="email"
                autoComplete="off"
                value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                placeholder="filter@example.com"
              />
            </div>
            <Button type="button" onClick={() => void applyFilter()}>
              Apply filter
            </Button>
          </div>

          {loading && <p className="text-sm text-[var(--color-muted-foreground)]">Loading…</p>}
          {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}

          {!loading && !error && rows.length === 0 ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">No documents match.</p>
          ) : null}

          {!loading && rows.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
              <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
                <thead className="bg-[var(--color-muted)]">
                  <tr>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      File
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      Recipient
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      Created
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      Status
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((doc) => (
                    <tr key={doc.id} className="odd:bg-[var(--color-background)]">
                      <td className="border-b border-[var(--color-border)] px-2 py-2">
                        <span className="font-medium">{doc.fileName}</span>
                        <p className="font-mono text-xs text-[var(--color-muted-foreground)]">
                          {doc.id}
                        </p>
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2">
                        {doc.recipientEmail}
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2 whitespace-nowrap">
                        {formatTs(doc.createdAt)}
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2 text-xs">
                        <div className="flex flex-wrap gap-1">
                          <span
                            className={
                              doc.linkActive
                                ? 'rounded bg-[var(--color-badge-active)] px-1.5 py-0.5'
                                : 'rounded bg-[var(--color-badge-inactive)] px-1.5 py-0.5'
                            }
                          >
                            link {doc.linkActive ? 'on' : 'off'}
                          </span>
                          <span
                            className={
                              doc.fileAvailable
                                ? 'rounded bg-[var(--color-badge-active)] px-1.5 py-0.5'
                                : 'rounded bg-[var(--color-badge-inactive)] px-1.5 py-0.5'
                            }
                          >
                            file {doc.fileAvailable ? 'on' : 'off'}
                          </span>
                          {doc.isUsed ? (
                            <span className="rounded bg-[var(--color-muted)] px-1.5 py-0.5">
                              downloaded
                            </span>
                          ) : null}
                          {doc.deletedAt ? (
                            <span className="rounded bg-[var(--color-muted)] px-1.5 py-0.5">
                              deleted
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/documents/${doc.id}`}>Detail</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Showing {total === 0 ? 0 : offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of{' '}
              {total}
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
    </div>
  );
}
