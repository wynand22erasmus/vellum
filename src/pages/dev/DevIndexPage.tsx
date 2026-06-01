/**
 * Development tools hub listing available admin-only embeds.
 *
 * @packageDocumentation
 */

import { NavTileGrid } from '@/components/layout/nav-tile-grid';
import { useSidebarNavGroups } from '@/hooks/use-sidebar-nav-groups';

/** Show navigation tiles for development services (`/dev`). */
export function DevIndexPage() {
  const nav = useSidebarNavGroups();
  const development = nav.sections.find((section) => section.id === 'development');

  const tiles =
    development?.children.map((child) => ({
      id: child.id,
      href: child.href,
      label: child.label,
      description: child.description ?? '',
    })) ?? [];

  return (
    <>
      <NavTileGrid items={tiles} />
    </>
  );
}
