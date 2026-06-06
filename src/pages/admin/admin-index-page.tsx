/**
 * Admin landing tiles.
 *
 * @packageDocumentation
 */

import { ADMIN_INDEX_TILES, PAGE_LABELS } from '@/lib/page-labels';
import { NavIndexTile } from '@/components/layout/nav-index-tile';
import { PageContainer } from '@/components/layout/page-container';
import { normalizeAppPath } from '@/lib/sidebar-nav';

/** Admin hub at `/admin`. */
export function AdminIndexPage() {
  return (
    <PageContainer title={PAGE_LABELS.admin.nav} description={PAGE_LABELS.admin.description} variant="wide">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ADMIN_INDEX_TILES.map((tile) => (
          <NavIndexTile
            key={tile.id}
            id={tile.id}
            to={normalizeAppPath(tile.href)}
            label={tile.label}
            description={tile.description}
          />
        ))}
      </div>
    </PageContainer>
  );
}
