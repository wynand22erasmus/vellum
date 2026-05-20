/**
 * Admin document detail with related audit log timeline.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card.tsx';
import { apiFetch } from '../../lib/api.ts';

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

type DocumentDetail = {
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
  auditLogs: AuditRow[];
};

function formatTs(iso: string): string {
  return new Date(iso).toLocaleString();
}

/** Single document + audit trail (`/admin/documents/:id`). */
export function AdminDocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(id ? null : 'Missing document id.');

  useEffect(() => {
    if (!id) {
      return;
    }
    const docId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const res = await apiFetch(`/api/admin/documents/${encodeURIComponent(docId)}`);
      if (cancelled) {
        return;
      }
      if (res.status === 401) {
        window.location.href = `/login?returnTo=${encodeURIComponent(`/admin/documents/${docId}`)}`;
        return;
      }
      if (res.status === 403) {
        setError('Admin access required.');
        setLoading(false);
        return;
      }
      if (res.status === 404) {
        setError('Document not found.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Failed to load document.');
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { document: DocumentDetail };
      setDoc(data.document);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-error)]">Missing document id.</p>
        <Button variant="outline" asChild>
          <Link to="/admin/documents">Back to documents</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-[var(--color-muted-foreground)]">Loading…</p>;
  }
  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-[var(--color-error)]">{error}</p>
        <Button variant="outline" asChild>
          <Link to="/admin/documents">Back to documents</Link>
        </Button>
      </div>
    );
  }
  if (!doc) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/documents">← Documents</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{doc.fileName}</CardTitle>
          <CardDescription className="font-mono text-xs">{doc.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Recipient</dt>
              <dd>{doc.recipientEmail}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Created</dt>
              <dd>{formatTs(doc.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Link expires</dt>
              <dd>{formatTs(doc.linkExpiresAt)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">File expires</dt>
              <dd>{formatTs(doc.fileExpiresAt)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Record expires</dt>
              <dd>{formatTs(doc.recordExpiresAt)}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Storage</dt>
              <dd>{doc.storageAttached ? 'Object attached' : 'No object key'}</dd>
            </div>
            <div>
              <dt className="text-[var(--color-muted-foreground)]">Flags</dt>
              <dd className="space-x-2">
                <span>Used: {doc.isUsed ? 'yes' : 'no'}</span>
                <span>Deleted: {doc.deletedAt ? formatTs(doc.deletedAt) : '—'}</span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit trail</CardTitle>
          <CardDescription>
            Up to 500 events for this document (newest first). Metadata may contain sensitive context —
            handle accordingly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {doc.auditLogs.length === 0 ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">No audit events yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
              <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
                <thead className="bg-[var(--color-muted)]">
                  <tr>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      Time
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      Event
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      User
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      IP
                    </th>
                    <th className="border-b border-[var(--color-border)] px-2 py-2 font-medium">
                      Metadata
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {doc.auditLogs.map((log) => (
                    <tr key={log.id} className="align-top odd:bg-[var(--color-background)]">
                      <td className="border-b border-[var(--color-border)] px-2 py-2 whitespace-nowrap">
                        {formatTs(log.timestamp)}
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2">
                        {log.eventType}
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2 font-mono text-xs">
                        {log.userId ?? '—'}
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2 text-xs">
                        {log.ipAddress ?? '—'}
                      </td>
                      <td className="border-b border-[var(--color-border)] px-2 py-2 text-xs">
                        <pre className="max-h-40 max-w-md overflow-auto whitespace-pre-wrap break-all rounded bg-[var(--color-muted)] p-2">
                          {log.metadata == null
                            ? '—'
                            : JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
