import { NavTileGrid } from '@/components/layout/nav-tile-grid';
import { ADMIN_INDEX_TILES } from '@/lib/page-labels';

export function AdminIndexPage() {
  return <NavTileGrid items={ADMIN_INDEX_TILES} />;
}
