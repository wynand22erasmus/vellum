/**
 * Development login form (stores recipient email for `X-Dev-User-Email`).
 *
 * @packageDocumentation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { setDevEmail } from '../lib/api.ts';

/** Dev auth route (`/login`); not used when `AUTH_PROVIDER=workos`. */
export function DevLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setDevEmail(email.trim());
    navigate('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} className="max-w-[220px]" />
          <CardTitle className="pt-2">Dev Login</CardTitle>
          <CardDescription>
            Enter your recipient email to simulate dashboard access. In production, use WorkOS SSO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full">
              Continue to dashboard
            </Button>
            <p className="text-center text-sm text-[var(--color-muted-foreground)]">
              Or{' '}
              <a
                href="/api/auth/login"
                className="text-[var(--color-secondary)] underline decoration-[var(--color-accent)] underline-offset-2 hover:text-[var(--color-primary)]"
              >
                sign in with WorkOS
              </a>{' '}
              when AUTH_PROVIDER=workos
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
