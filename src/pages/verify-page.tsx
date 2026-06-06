/**
 * Verify password page (form only — shell from `AuthLayout`).
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { problemActionRequired } from '@/lib/api';
import { apiPost, ApiQueryError } from '@/lib/api-client';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import { triggerFileDownload } from '@/lib/verify-routes';
import { AuthCard } from '@/components/layout/auth-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** Password entry step for secure document download. */
export function VerifyPage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [actionRequired, setActionRequired] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    setActionRequired(null);
    try {
      const data = await apiPost<{ downloadUrl?: string; fileName?: string }>('/api/verify', {
        token,
        password,
      });
      if (data.downloadUrl) {
        void navigate({
          to: '/verify/$token/complete',
          params: { token },
          replace: true,
        });
        triggerFileDownload(data.downloadUrl, data.fileName);
      }
    } catch (err) {
      if (err instanceof ApiQueryError) {
        setError(err.message);
        const action = problemActionRequired(err.problem);
        if (action) setActionRequired(action);
        return;
      }
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title={PAGE_LABELS.secureDocumentDownload.nav}
      description={panelDescription(PAGE_LABELS.secureDocumentDownload)}
      className="max-w-md"
      elevated
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">File password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        {error ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>
              {error}
              {actionRequired ? <p className="mt-2 opacity-90">{actionRequired}</p> : null}
            </AlertDescription>
          </Alert>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading || !token}>
          {loading ? 'Verifying…' : 'Download document'}
        </Button>
      </form>
    </AuthCard>
  );
}
