/**
 * Email verification page (form only — shell from `AuthLayout`).
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';
import { apiPost, ApiQueryError } from '@/lib/api-client';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import { AuthCard } from '@/components/layout/auth-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { normalizeAppPath } from '@/lib/sidebar-nav';

/** Resend email verification link for pending accounts. */
export function EmailVerificationPage() {
  const search = useSearch({ strict: false }) as { pending?: string };
  const pending = search.pending;
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleResend() {
    if (!pending) return;
    setLoading(true);
    setError(null);
    try {
      await apiPost('/api/auth/resend-verification', { pending });
      setSent(true);
      toast.success('Verification email sent');
    } catch (err) {
      if (err instanceof ApiQueryError) {
        setError(err.message);
        return;
      }
      setError('Could not resend verification email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title={PAGE_LABELS.emailVerification.nav}
      description={panelDescription(PAGE_LABELS.emailVerification)}
      showLogo={false}
      elevated
    >
      {sent ? (
        <Alert className="border-success/30 bg-success-muted">
          <AlertDescription className="text-success">Check your inbox for the verification link.</AlertDescription>
        </Alert>
      ) : null}
      {pending ? (
        <Button className="w-full" disabled={loading} onClick={() => void handleResend()}>
          {loading ? 'Sending…' : 'Resend verification email'}
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">No pending verification token in this link.</p>
      )}
      {error ? (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <p className="mt-4 text-center text-sm">
        <Link to={normalizeAppPath('/login')} className="text-secondary underline underline-offset-2">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
