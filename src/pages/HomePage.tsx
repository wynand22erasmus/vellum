/**
 * Marketing landing page with links to login and product overview.
 *
 * @packageDocumentation
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { VellumLogo } from '../components/vellum-logo.tsx';
import { Button } from '../components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '../components/ui/card.tsx';
import { apiFetch } from '../lib/api.ts';

type MeUser = {
  kind: 'ADMIN' | 'CONSUMER';
};

/** Public home route (`/`). */
export function HomePage() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await apiFetch('/api/auth/me');
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as { user: MeUser };
        if (!cancelled && data.user.kind === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch {
        // ignore — visitor is not signed in
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <VellumLogo variant="full" linked={false} />
          <CardDescription className="pt-2">
            Secure document transfer for regulated industries. Two-key access: email link plus file
            password.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild>
            <Link to="/login">Recipient dashboard</Link>
          </Button>
          {isAdmin ? (
            <Button variant="outline" asChild>
              <a href="/docs/">API documentation</a>
            </Button>
          ) : null}
          <p className="text-xs text-[var(--color-muted-foreground)]">
            API upload: POST /api/upload with Authorization: Bearer API_KEY
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
