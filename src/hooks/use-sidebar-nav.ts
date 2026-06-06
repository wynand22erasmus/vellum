/**
 * Sidebar navigation groups.
 *
 * @packageDocumentation
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { useAuthMe } from '@/providers/auth-provider';
import type { DevServiceLink } from '@/lib/dev-services';
import { buildSidebarNav } from '@/lib/sidebar-nav';
import { apiGet } from '@/lib/api-client';

type MetaResponse = {
  isProduction: boolean;
  devServices: DevServiceLink[];
};

/** Sidebar nav for shell. */
export function useSidebarNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user } = useAuthMe();
  const [devServices, setDevServices] = useState<DevServiceLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const data = await apiGet<MetaResponse>('/api/meta');
        if (!cancelled && !data.isProduction) {
          setDevServices(data.devServices);
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => buildSidebarNav({ user, devServices }),
    [pathname, user, devServices],
  );
}
