/**
 * Development login and WorkOS sign-in entry point.
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { VellumLogo } from '@/components/vellum-logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthMe } from '@/hooks/use-auth-me';
import { setDevEmail } from '@/lib/api';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import { safeReturnTo } from '@/lib/auth';

type RequestLoginResponse = {
  verified: boolean;
  email: string;
  pending?: string;
  message?: string;
};

/** Collect email for dev login or redirect to WorkOS sign-in (`/login`). */
export function DevLoginPage() {
  const { user, loading: authLoading, refresh } = useAuthMe();
  const navigate = useNavigate();
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
      <div className="flex flex-1 items-center justify-center p-4">
        <Skeleton className="h-8 w-40" />
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
        const signedInUser = await refresh();
        if (!signedInUser) {
          setError('Signed in, but your session could not be loaded. Please try again.');
          return;
        }
        toast.success('Signed in');
        navigate(returnTo, { replace: true });
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
    if (!pendingToken) return;
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
      toast.success('Verification email sent');
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
          <CardTitle className="pt-2">{PAGE_LABELS.devLogin.nav}</CardTitle>
          <CardDescription>{panelDescription(PAGE_LABELS.devLogin)}</CardDescription>
        </CardHeader>
        <CardContent>
          {verifiedBanner ? (
            <Alert className="mb-4 border-success/30 bg-success-muted">
              <AlertDescription className="text-success">
                Email verified. Enter your address below to continue.
              </AlertDescription>
            </Alert>
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
          {error ? (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
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
