import { NavTileGrid } from '@/components/layout/nav-tile-grid';
import { PageTitleBlock } from '@/components/layout/page-title-block';
import { useSidebarNavGroups } from '@/hooks/use-sidebar-nav-groups';

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
      <PageTitleBlock />
      <NavTileGrid items={tiles} />
    </>
  );
}
