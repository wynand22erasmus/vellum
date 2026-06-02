/**
 * Secure document download password gate for recipients.
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VellumLogo } from '@/components/vellum-logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseProblem, problemMessage } from '@/lib/api';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import { triggerFileDownload } from '@/lib/verify-routes';

/** Verify a download password and trigger the file transfer (`/verify/:token`). */
export function VerifyPage() {
  const { token } = useParams<{ token: string }>();
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
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const problem = await parseProblem(res);
        setError(problemMessage(problem));
        if (typeof problem.actionRequired === 'string') {
          setActionRequired(problem.actionRequired);
        }
        return;
      }

      const data = (await res.json()) as { downloadUrl?: string; fileName?: string };
      if (data.downloadUrl) {
        triggerFileDownload(data.downloadUrl, data.fileName);
        navigate(`/verify/${token}/complete`, { replace: true });
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} />
          <CardTitle className="pt-2">{PAGE_LABELS.secureDocumentDownload.nav}</CardTitle>
          <CardDescription>{panelDescription(PAGE_LABELS.secureDocumentDownload)}</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
