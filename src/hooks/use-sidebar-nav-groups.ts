/**
 * Builds sidebar navigation groups from session user and dev service metadata.
 *
 * @packageDocumentation
 */

import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthMe } from '@/hooks/use-auth-me';
import { buildSidebarNav, type SidebarNavModel } from '@/lib/sidebar-nav';
import type { DevServiceLink } from '@/lib/dev-services';

type MetaResponse = {
  isProduction: boolean;
  devServices: DevServiceLink[];
};

/**
 * Returns the sidebar nav model for the current route and authenticated user.
 *
 * Fetches dev service links from `/api/meta` in non-production environments.
 */
export function useSidebarNavGroups(): SidebarNavModel {
  const { pathname } = useLocation();
  const { user } = useAuthMe();
  const [devServices, setDevServices] = useState<DevServiceLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) return;
        const data = (await res.json()) as MetaResponse;
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
    () => buildSidebarNav({ pathname, user, devServices }),
    [pathname, user, devServices],
  );
}
