/**
 * Re-runs route `beforeLoad` guards when auth context changes.
 *
 * @packageDocumentation
 */

import { useEffect } from 'react';
import type { AuthContextValue } from '@/providers/auth-provider';

/** Invalidate the router when session state changes (login/logout/refresh). */
export function RouterAuthSync({
  router,
  auth,
}: {
  router: { invalidate: () => Promise<void> };
  auth: AuthContextValue;
}) {
  useEffect(() => {
    void router.invalidate();
  }, [router, auth.user, auth.isAdmin, auth.loading]);

  return null;
}
