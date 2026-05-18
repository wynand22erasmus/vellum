/**
 * Recipient password gate for email download links (`/verify/:token`).
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { VellumLogo } from '../components/vellum-logo.tsx';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Label } from '../components/ui/label.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.tsx';

/** Public verify route; posts to `POST /api/verify`. */
export function VerifyPage() {
  const { token } = useParams<{ token: string }>();
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

      const data = (await res.json()) as {
        error?: string;
        actionRequired?: string;
        downloadUrl?: string;
      };

      if (!res.ok) {
        setError(data.error ?? 'Verification failed.');
        if (data.actionRequired) setActionRequired(data.actionRequired);
        return;
      }

      if (data.downloadUrl) {
        window.location.href = data.downloadUrl;
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} className="max-w-[220px]" />
          <CardTitle className="pt-2">Secure Document Download</CardTitle>
          <CardDescription>
            Enter the file password you received separately. If your download does not start,
            log in to your Vellum dashboard to request a new link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {error && (
              <div
                className="rounded-md bg-[var(--color-error-muted)] p-3 text-sm text-[var(--color-error)]"
                role="alert"
              >
                {error}
                {actionRequired && (
                  <p className="mt-2 opacity-90">{actionRequired}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? 'Verifying…' : 'Download document'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
