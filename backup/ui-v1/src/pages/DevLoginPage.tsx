/**
 * Development login form (stores recipient email for `X-Dev-User-Email`).
 *
 * @packageDocumentation
 * @remarks
 * Users must verify their email via Mailpit before the dashboard accepts requests.
 * Set `SKIP_EMAIL_VERIFICATION=true` only for automated E2E runs.
 */

import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useAuthMe } from '../hooks/use-auth-me.ts';
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
import { safeReturnTo } from '../lib/auth/returnTo.ts';
import { setDevEmail } from '../lib/api.ts';

type RequestLoginResponse = {
  verified: boolean;
  email: string;
  pending?: string;
  message?: string;
};

/** Dev auth route (`/login`); not used when `AUTH_PROVIDER=workos`. */
export function DevLoginPage() {
  const { user, loading: authLoading } = useAuthMe();
  const [searchParams] = useSearchParams();
  const verifiedBanner = searchParams.get('verified') === '1';
  const returnTo = safeReturnTo(searchParams.get('returnTo') ?? undefined);
  const [email, setEmail] = useState('');
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to={returnTo} replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/dev/request-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as RequestLoginResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? 'Sign-in failed.');
      }

      if (data.verified) {
        setDevEmail(data.email);
        window.location.assign(returnTo);
        return;
      }

      setAwaitingVerification(true);
      setPendingToken(data.pending ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!pendingToken) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pending: pendingToken }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? 'Could not resend verification email.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend verification email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} />
          <CardTitle className="pt-2">Dev Login</CardTitle>
          <CardDescription>
            Enter your email to access the dashboard. You must verify your address before signing in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verifiedBanner ? (
            <p className="mb-4 text-sm text-green-700 dark:text-green-400">
              Email verified. Enter your address below to continue.
            </p>
          ) : null}
          {awaitingVerification ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We sent a verification link to <strong>{email}</strong>. Open it in Mailpit, then
                return here and sign in again.
              </p>
              <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={() => void handleResend()}>
                Resend verification email
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setAwaitingVerification(false);
                  setPendingToken(null);
                }}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending…' : 'Continue'}
              </Button>
            </form>
          )}
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Or{' '}
            <a
              href="/api/auth/login"
              className="text-secondary underline decoration-brand-accent underline-offset-2 hover:text-primary"
            >
              sign in with WorkOS
            </a>{' '}
            when AUTH_PROVIDER=workos
          </p>
          <p className="text-center text-sm">
            <Link to="/" className="text-secondary underline underline-offset-2">
              Back to home
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
