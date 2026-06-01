/**
 * Card grid of navigation tiles for index and hub pages.
 *
 * @packageDocumentation
 */

import { Link } from 'react-router-dom';
import { SidebarLinkIcon } from '@/components/layout/sidebar-link-icon';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/** Single tile entry in a {@link NavTileGrid}. */
export type NavTileItem = {
  id: string;
  href: string;
  label: string;
  description: string;
};

/** Render linked cards for a list of navigation destinations. */
export function NavTileGrid({ items }: { items: readonly NavTileItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No items available.</p>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <li key={item.href}>
          <Card className="h-full transition-colors hover:border-primary/40">
            <Link to={item.href} className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <CardHeader className="gap-3">
                <div className="flex items-center gap-2">
                  <SidebarLinkIcon id={item.id} className="size-5 text-primary" />
                  <CardTitle className="text-base font-semibold">{item.label}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">{item.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
