/**
 * Login page (form only — shell from `AuthLayout` via `/login` route).
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuthMe } from '@/providers/auth-provider';
import { setDevEmail } from '@/lib/api';
import { apiPost } from '@/lib/api-client';
import { safeReturnTo } from '@/lib/auth';
import { PAGE_LABELS, panelDescription } from '@/lib/page-labels';
import {
  AuthCard,
  AuthMobileBrandHeader,
} from '@/components/layout/auth-layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { normalizeAppPath } from '@/lib/sidebar-nav';

type RequestLoginResponse = {
  verified: boolean;
  email: string;
  pending?: string;
  message?: string;
};

const showDevLogin = import.meta.env.DEV;

function workosLoginHref(returnTo: string): string {
  const params = new URLSearchParams();
  if (returnTo && returnTo !== normalizeAppPath('/dashboard')) {
    params.set('returnTo', returnTo);
  }
  const query = params.toString();
  return query ? `/api/auth/login?${query}` : '/api/auth/login';
}

function LoginLoadingSkeleton() {
  return (
    <div className="flex w-full max-w-[26rem] flex-col gap-6">
      <AuthMobileBrandHeader />
      <div className="rounded-4xl bg-card/95 p-8 shadow-xl ring-1 ring-primary/10">
        <Skeleton className="mx-auto mb-4 h-7 w-32" />
        <Skeleton className="mx-auto mb-6 h-4 w-full max-w-[16rem]" />
        <Skeleton className="h-10 w-full rounded-4xl" />
      </div>
    </div>
  );
}

/** Sign-in at `/login`. */
export function LoginPage() {
  const { user, loading: authLoading, refresh } = useAuthMe();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { verified?: string; returnTo?: string };
  const verifiedBanner = search.verified === '1';
  const returnTo = safeReturnTo(search.returnTo ?? normalizeAppPath('/dashboard'));
  const [email, setEmail] = useState('');
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authLoading) {
    return <LoginLoadingSkeleton />;
  }

  if (user) {
    void navigate({ to: returnTo, replace: true });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await apiPost<RequestLoginResponse>('/api/auth/dev/request-login', {
        email: email.trim(),
      });
      if (data.verified) {
        setDevEmail(data.email);
        const signedInUser = await refresh();
        if (!signedInUser) {
          setError('Signed in, but your session could not be loaded. Please try again.');
          return;
        }
        toast.success('Signed in');
        void navigate({ to: returnTo, replace: true });
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
      await apiPost('/api/auth/resend-verification', { pending: pendingToken });
      toast.success('Verification email sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend verification email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AuthMobileBrandHeader />
      <AuthCard
        title={PAGE_LABELS.signIn.nav}
        description={panelDescription(PAGE_LABELS.devLogin)}
        showLogo={false}
        elevated
      >
        {verifiedBanner ? (
          <Alert className="mb-5 border-success/30 bg-success-muted">
            <AlertDescription className="text-success">
              Email verified. Sign in below to continue.
            </AlertDescription>
          </Alert>
        ) : null}

        <Button asChild size="lg" className="group w-full shadow-md shadow-primary/15">
          <a href={workosLoginHref(returnTo)}>
            Continue with WorkOS
            <ArrowRight
              className="ml-1 size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </Button>

        {showDevLogin ? (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-border/80" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-[0.6875rem] font-medium tracking-wider text-muted-foreground uppercase">
                  Or continue with email
                </span>
              </div>
            </div>

            {awaitingVerification ? (
              <div className="space-y-4 rounded-2xl bg-muted/50 p-4 ring-1 ring-border/60">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  We sent a verification link to{' '}
                  <strong className="font-medium text-foreground">{email}</strong>. Open it in
                  Mailpit, then return here and sign in again.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                  onClick={() => void handleResend()}
                >
                  Resend verification email
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground"
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
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                  {loading ? 'Sending…' : 'Continue with email'}
                </Button>
              </form>
            )}
          </>
        ) : null}

        {error ? (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
      </AuthCard>
    </>
  );
}
