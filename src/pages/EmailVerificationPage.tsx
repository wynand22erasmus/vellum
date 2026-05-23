import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { VellumLogo } from '@/components/vellum-logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const pending = searchParams.get('pending') ?? '';
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canResend = useMemo(() => pending.length > 0, [pending]);

  async function handleResend() {
    if (!canResend) return;
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
      toast.success('Verification email sent');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to resend verification email.');
    }
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} />
          <CardTitle className="pt-2">{PAGE_LABELS.verifyEmail.nav}</CardTitle>
          <CardDescription>{panelDescription(PAGE_LABELS.verifyEmail)}</CardDescription>
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
            <Alert className="border-success/30 bg-success-muted">
              <AlertDescription className="text-success">Verification email sent.</AlertDescription>
            </Alert>
          ) : null}
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}
          <Button variant="outline" asChild className="w-full">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
