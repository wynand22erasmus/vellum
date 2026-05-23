import { NavTileGrid } from '@/components/layout/nav-tile-grid';
import { PageTitleBlock } from '@/components/layout/page-title-block';
import { ADMIN_INDEX_TILES } from '@/lib/page-labels';

export function AdminIndexPage() {
  return (
    <>
      <PageTitleBlock />
      <NavTileGrid items={ADMIN_INDEX_TILES} />
    </>
  );
}
