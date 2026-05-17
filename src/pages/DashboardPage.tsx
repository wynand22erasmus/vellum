import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VellumLogo } from '../components/vellum-logo.tsx';
import { Button } from '../components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.tsx';
import { apiFetch, clearDevEmail, getDevEmail } from '../lib/api.ts';

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

  function handleLogout() {
    clearDevEmail();
    void apiFetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  const devEmail = getDevEmail();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <VellumLogo variant="mark" />
            {devEmail && (
              <p className="text-sm text-[var(--color-muted-foreground)]">{devEmail}</p>
            )}
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Your documents</CardTitle>
            <CardDescription>
              Documents addressed to you. Request a new access link — downloads always require
              the email link and file password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-sm text-[var(--color-muted-foreground)]">Loading…</p>}
            {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
            {message && <p className="mb-4 text-sm text-[var(--color-success)]">{message}</p>}

            {!loading && documents.length === 0 && (
              <p className="text-sm text-[var(--color-muted-foreground)]">No documents yet.</p>
            )}

            <ul className="space-y-4">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex flex-col gap-3 rounded-md border border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{doc.fileName}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
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
                        <span className="rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-xs">
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

        <p className="mt-4 text-center text-sm text-[var(--color-muted-foreground)]">
          <Link
            to="/"
            className="text-[var(--color-secondary)] underline decoration-[var(--color-accent)] underline-offset-2 hover:text-[var(--color-primary)]"
          >
            Home
          </Link>
        </p>
      </main>
    </div>
  );
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs ${
        active
          ? 'bg-[var(--color-badge-active)] text-[var(--color-badge-active-foreground)]'
          : 'bg-[var(--color-badge-inactive)] text-[var(--color-badge-inactive-foreground)]'
      }`}
    >
      {label}
    </span>
  );
}
