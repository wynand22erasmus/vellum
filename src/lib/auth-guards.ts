/**
 * Admin route guard helpers for the app.
 *
 * @packageDocumentation
 */

import { redirect } from '@tanstack/react-router';
import type { AuthContextValue } from '@/providers/auth-provider';
import { normalizeAppPath } from '@/lib/sidebar-nav';

function getAuth(context: unknown): AuthContextValue {
  return (context as { auth: AuthContextValue }).auth;
}

/** Redirect unauthenticated users to login. */
export function requireAuth(context: unknown, returnPath: string) {
  const auth = getAuth(context);
  if (auth.loading) return;
  if (!auth.user) {
    throw redirect({
      to: normalizeAppPath('/login'),
      search: { returnTo: returnPath },
    });
  }
}

/** Redirect non-admin users away from admin routes. */
export function requireAdmin(context: unknown, returnPath: string) {
  requireAuth(context, returnPath);
  const auth = getAuth(context);
  if (auth.loading) return;
  if (!auth.isAdmin) {
    throw redirect({ to: normalizeAppPath('/dashboard') });
  }
}
