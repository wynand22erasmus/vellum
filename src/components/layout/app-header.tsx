/**
 * Top app bar with sidebar toggle, breadcrumb trail, and route subheader.
 *
 * @packageDocumentation
 */

import { ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { NavTrail } from '@/components/layout/nav-trail';
import { useRouteChrome } from '@/components/layout/route-chrome-provider';
import { Button } from '@/components/ui/button';
import { useSidebarNavGroups } from '@/hooks/use-sidebar-nav-groups';
import { resolveDevServiceUrl } from '@/lib/dev-embed';
import { resolveRouteHeader } from '@/lib/route-meta';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { DevServiceLink } from '@/lib/dev-services';

type MetaResponse = {
  devServices: DevServiceLink[];
};

/** Display route breadcrumbs and optional dev-service subheader actions. */
export function AppHeader() {
  const { pathname } = useLocation();
  const { serviceId } = useParams<{ serviceId?: string }>();
  const nav = useSidebarNavGroups();
  const { trailTailLabel } = useRouteChrome();

  const [devServices, setDevServices] = useState<DevServiceLink[]>([]);
  const isDevEmbed = pathname.startsWith('/dev/') && Boolean(serviceId);

  useEffect(() => {
    if (!isDevEmbed) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/meta');
        if (!res.ok) return;
        const data = (await res.json()) as MetaResponse;
        if (!cancelled) setDevServices(data.devServices);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isDevEmbed, serviceId]);

  const metaService = serviceId ? resolveDevServiceUrl(serviceId, devServices) : undefined;

  const { trail, subheader } = useMemo(
    () =>
      resolveRouteHeader(pathname, nav, {
        devServiceId: isDevEmbed ? serviceId : undefined,
        devServiceDescription: metaService?.description,
        devServiceExternalUrl: metaService?.url,
      }),
    [pathname, nav, isDevEmbed, serviceId, metaService],
  );

  const displayTrail = useMemo(() => {
    if (!trailTailLabel || trail.length === 0) {
      return trail;
    }
    const next = [...trail];
    next[next.length - 1] = { ...next[next.length - 1], label: trailTailLabel };
    return next;
  }, [trail, trailTailLabel]);

  return (
    <header className="shrink-0 border-b border-border">
      <div className="flex h-12 items-center gap-2 px-4">
        <SidebarTrigger />
        <NavTrail segments={displayTrail} />
      </div>
      {subheader ? (
        <div className="flex flex-col gap-2 border-t border-border px-4 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{subheader.description}</p>
          {subheader.externalUrl ? (
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <a href={subheader.externalUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Open in new tab
              </a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
