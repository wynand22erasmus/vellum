import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { PageSection } from '@/components/layout/page-section';
import { useRouteChrome } from '@/components/layout/route-chrome-provider';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiFetch } from '@/lib/api';

type AuditRow = {
  id: string;
  eventType: string;
  timestamp: string;
  userId: string | null;
  documentId: string | null;
  ipAddress: string | null;
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

export function AdminDocumentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setTrailTailLabel } = useRouteChrome();
  const [doc, setDoc] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(id ? null : 'Missing document id.');

  useEffect(() => {
    if (doc?.fileName) {
      setTrailTailLabel(doc.fileName);
    } else {
      setTrailTailLabel(null);
    }
    return () => setTrailTailLabel(null);
  }, [doc?.fileName, setTrailTailLabel]);

  useEffect(() => {
    if (!id) return;
    const docId = id;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      const res = await apiFetch(`/api/admin/documents/${encodeURIComponent(docId)}`);
      if (cancelled) return;
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

  return (
    <div className="space-y-6">
      {doc ? <p className="font-mono text-xs text-muted-foreground">{doc.id}</p> : null}

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-24 w-full" />
          <TableLoadingSkeleton rows={4} />
        </div>
      ) : doc ? (
        <>
          <PageSection title="Metadata" description="Document lifecycle fields">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Recipient</dt>
                <dd className="font-medium">{doc.recipientEmail}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{formatTs(doc.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Link expires</dt>
                <dd>{formatTs(doc.linkExpiresAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">File expires</dt>
                <dd>{formatTs(doc.fileExpiresAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Record expires</dt>
                <dd>{formatTs(doc.recordExpiresAt)}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Storage</dt>
                <dd>{doc.storageAttached ? 'Attached' : 'Detached'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Status</dt>
                <dd className="mt-1">
                  <DocumentStatusBadges
                    linkActive={doc.linkActive}
                    fileAvailable={doc.fileAvailable}
                    isUsed={doc.isUsed}
                    deletedAt={doc.deletedAt}
                    formatDeletedAt={formatTs}
                  />
                </dd>
              </div>
            </dl>
          </PageSection>

          <PageSection
            title="Audit trail"
            description={`${doc.auditLogs.length} events (up to 500)`}
          >
            {doc.auditLogs.length === 0 ? (
              <EmptyState title="No audit events" />
            ) : (
              <PageContainer.TableFrame>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doc.auditLogs.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="whitespace-nowrap">{formatTs(row.timestamp)}</TableCell>
                        <TableCell>{row.eventType}</TableCell>
                        <TableCell className="font-mono text-xs">{row.userId ?? '—'}</TableCell>
                        <TableCell className="text-xs">{row.ipAddress ?? '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </PageContainer.TableFrame>
            )}
          </PageSection>

          <Button variant="link" asChild className="px-0">
            <Link to="/admin/documents">← Back to documents</Link>
          </Button>
        </>
      ) : null}
    </div>
  );
}
