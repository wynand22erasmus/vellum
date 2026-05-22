/**
 * Public home route: sends visitors to login or authenticated users to the dashboard.
 *
 * @packageDocumentation
 */

import { Navigate } from 'react-router-dom';
import { useAuthMe } from '../hooks/use-auth-me.ts';

/** Public home route (`/`). */
export function HomePage() {
  const { user, loading } = useAuthMe();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
