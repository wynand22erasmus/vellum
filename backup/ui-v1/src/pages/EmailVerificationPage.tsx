/**
 * Shown when sign-in succeeds at the identity provider but email is not yet verified.
 *
 * @packageDocumentation
 */

import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { VellumLogo } from '../components/vellum-logo.tsx';
import { Button } from '../components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card.tsx';

/**
 * Route: `/login/email-verification?pending=…`
 *
 * Displays instructions and a resend button backed by `POST /api/auth/resend-verification`.
 */
export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const pending = searchParams.get('pending') ?? '';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canResend = useMemo(() => pending.length > 0, [pending]);

  async function handleResend() {
    if (!canResend) {
      return;
    }
    setStatus('sending');
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pending }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? 'Failed to resend verification email.');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to resend verification email.');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} />
          <CardTitle className="pt-2">Verify your email</CardTitle>
          <CardDescription>
            We sent a verification message to your inbox. Confirm your email address, then return
            here to sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After verifying, use the same sign-in method you tried before (WorkOS or dev login).
          </p>
          {canResend ? (
            <Button
              type="button"
              className="w-full"
              disabled={status === 'sending'}
              onClick={() => void handleResend()}
            >
              {status === 'sending' ? 'Sending…' : 'Resend verification email'}
            </Button>
          ) : null}
          {status === 'sent' ? (
            <p className="text-sm text-green-700 dark:text-green-400">Verification email sent.</p>
          ) : null}
          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
          <Button variant="outline" asChild className="w-full">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
