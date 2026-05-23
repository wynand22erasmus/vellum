/**
 * Recipient dashboard: list documents and request new download links.
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.tsx';
import { apiFetch } from '../lib/api.ts';

interface DocumentRow {
  id: string;
  fileName: string;
  linkExpiresAt: string;
  fileExpiresAt: string;
  isUsed: boolean;
  linkActive: boolean;
  fileAvailable: boolean;
  createdAt: string;
}

/** Authenticated dashboard route (`/dashboard`). */
export function DashboardPage() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const res = await apiFetch('/api/documents');
      if (cancelled) return;
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!res.ok) {
        setError('Failed to load documents.');
        setLoading(false);
        return;
      }
      const data = (await res.json()) as { documents: DocumentRow[] };
      setDocuments(data.documents);
      setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiFetch('/api/documents');
    if (res.status === 401) {
      window.location.href = '/login';
      return;
    }
    if (!res.ok) {
      setError('Failed to load documents.');
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { documents: DocumentRow[] };
    setDocuments(data.documents);
    setLoading(false);
  }, []);

  async function requestLink(id: string) {
    setMessage(null);
    const res = await apiFetch(`/api/documents/${id}/request-link`, { method: 'POST' });
    const data = (await res.json()) as { message?: string; error?: string };
    if (!res.ok) {
      setError(data.error ?? 'Failed to request link.');
      return;
    }
    setMessage(data.message ?? 'Link sent.');
    void loadDocuments();
  }

  return (
    <main className="mx-auto max-w-5xl flex-1 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Your documents</CardTitle>
            <CardDescription>
              Documents addressed to you. Request a new access link — downloads always require
              the email link and file password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {error && <p className="text-sm text-error">{error}</p>}
            {message && <p className="mb-4 text-sm text-success">{message}</p>}

            {!loading && documents.length === 0 && (
              <p className="text-sm text-muted-foreground">No documents yet.</p>
            )}

            <ul className="space-y-4">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{doc.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      Received {new Date(doc.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <StatusBadge
                        label={doc.linkActive ? 'Link active' : 'Link expired'}
                        active={doc.linkActive}
                      />
                      <StatusBadge
                        label={doc.fileAvailable ? 'File available' : 'File scrubbed'}
                        active={doc.fileAvailable}
                      />
                      {doc.isUsed && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                          Downloaded
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    disabled={!doc.fileAvailable}
                    onClick={() => void requestLink(doc.id)}
                  >
                    Send access link
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link
            to="/"
            className="text-secondary underline decoration-brand-accent underline-offset-2 hover:text-primary"
          >
            Home
          </Link>
        </p>
    </main>
  );
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${
        active
          ? 'bg-badge-active text-badge-active-foreground'
          : 'bg-badge-inactive text-badge-inactive-foreground'
      }`}
    >
      {label}
    </span>
  );
}
