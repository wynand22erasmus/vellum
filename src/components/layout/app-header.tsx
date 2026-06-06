/**
 * Sticky header with breadcrumbs trail.
 *
 * @packageDocumentation
 */

import { useRouterState } from '@tanstack/react-router';
import { BreadcrumbTrail } from '@/components/layout/breadcrumb-trail';
import { resolveNavTrail } from '@/lib/nav-trail';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSidebarNav } from '@/hooks/use-sidebar-nav';
import { normalizeAppPath } from '@/lib/sidebar-nav';

/** Header bar for shell pages. */
export function AppHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = useSidebarNav();
  const innerPath = pathname;
  const segments = resolveNavTrail(innerPath, nav).map((seg) =>
    seg.href ? { ...seg, href: normalizeAppPath(seg.href) } : seg,
  );

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/50 bg-background/70 px-4 backdrop-blur-lg supports-backdrop-filter:bg-background/55">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <BreadcrumbTrail segments={segments} />
    </header>
  );
}
