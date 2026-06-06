/**
 * Index page tile with the same icon as the sidebar menu item.
 *
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { SidebarLinkIcon } from '@/components/layout/sidebar-link-icon';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type NavIndexTileProps = {
  id: string;
  to: string;
  label: string;
  description?: ReactNode;
};

/** Linked card tile for admin/dev hub pages. */
export function NavIndexTile({ id, to, label, description }: NavIndexTileProps) {
  return (
    <Link to={to}>
      <Card className="h-full transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/15">
            <SidebarLinkIcon id={id} className="size-5 text-primary" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-base">{label}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
