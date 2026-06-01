/**
 * Admin landing page with links to management screens.
 *
 * @packageDocumentation
 */

import { NavTileGrid } from '@/components/layout/nav-tile-grid';
import { ADMIN_INDEX_TILES } from '@/lib/page-labels';

/** Show navigation tiles for admin tools (`/admin`). */
export function AdminIndexPage() {
  return <NavTileGrid items={ADMIN_INDEX_TILES} />;
}
