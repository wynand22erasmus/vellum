/**
 * Recipient dashboard listing available secure document downloads.
 *
 * @packageDocumentation
 */

import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { DocumentStatusBadges } from '@/components/features/document-status-badges';
import { EmptyState } from '@/components/layout/empty-state';
import { PageContainer } from '@/components/layout/page-container';
import { TableLoadingSkeleton } from '@/components/layout/table-loading-skeleton';
import { RequireAuth } from '@/components/layout/require-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiFetch } from '@/lib/api';

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

function DashboardContent() {
  const [documents, setDocuments] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await apiFetch('/api/documents');
    if (!res.ok) {
      setError('Failed to load documents.');
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { documents: DocumentRow[] };
    setDocuments(data.documents);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadDocuments();
  }, [loadDocuments]);

  async function requestLink(id: string) {
    const res = await apiFetch(`/api/documents/${id}/request-link`, { method: 'POST' });
    const data = (await res.json()) as { message?: string; error?: string };
    if (!res.ok) {
      toast.error(data.error ?? 'Failed to request link.');
      return;
    }
    toast.success(data.message ?? 'Link sent.');
    void loadDocuments();
  }

  return (
    <PageContainer variant="narrow">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {loading ? (
        <TableLoadingSkeleton />
      ) : documents.length === 0 ? (
        <EmptyState title="No documents yet" />
      ) : (
        <PageContainer.TableFrame>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.fileName}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {new Date(doc.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DocumentStatusBadges
                      linkActive={doc.linkActive}
                      fileAvailable={doc.fileAvailable}
                      isUsed={doc.isUsed}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!doc.fileAvailable}
                      onClick={() => void requestLink(doc.id)}
                    >
                      Send access link
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PageContainer.TableFrame>
      )}

      <p className="text-center text-sm text-muted-foreground">
        <Link
          to="/dashboard"
          className="text-secondary underline decoration-brand-accent underline-offset-2 hover:text-primary"
        >
          Home
        </Link>
      </p>
    </PageContainer>
  );
}

/** Show the authenticated recipient's downloadable documents (`/dashboard`). */
export function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
