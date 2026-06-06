/**
 * Dev services index.
 *
 * @packageDocumentation
 */

import { PAGE_LABELS } from '@/lib/page-labels';
import { NavIndexTile } from '@/components/layout/nav-index-tile';
import { PageContainer } from '@/components/layout/page-container';
import { useSidebarNav } from '@/hooks/use-sidebar-nav';

/** Dev tools index listing embeddable services. */
export function DevIndexPage() {
  const nav = useSidebarNav();
  const devSection = nav.sections.find((s) => s.id === 'development');

  return (
    <PageContainer title={PAGE_LABELS.development.nav} description={PAGE_LABELS.development.description} variant="wide">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {devSection?.children.map((child) => (
          <NavIndexTile
            key={child.id}
            id={child.id}
            to={child.href}
            label={child.label}
            description={child.description}
          />
        ))}
      </div>
    </PageContainer>
  );
}
