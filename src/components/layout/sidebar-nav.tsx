/**
 * Sidebar navigation with TanStack Router links.
 *
 * @packageDocumentation
 */

import { Link, useRouterState } from '@tanstack/react-router';
import { SidebarLinkIcon } from '@/components/layout/sidebar-link-icon';
import type { SidebarLinkItem, SidebarNavModel, SidebarNavSection } from '@/lib/sidebar-nav';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';

const SUB_ITEM_CLASS =
  'h-9 gap-2 px-3 text-sm [&>span:last-child]:truncate';

function linkIsActive(pathname: string, href: string): boolean {
  if (href.endsWith('/dashboard') || href.endsWith('/admin') || href.endsWith('/dev')) {
    return pathname === href;
  }
  if (href.includes('/dev/')) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinkItem({ item }: { item: SidebarLinkItem }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = linkIsActive(pathname, item.href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        <Link to={item.href}>
          <SidebarLinkIcon id={item.id} />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavSection({ section }: { section: SidebarNavSection }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (section.href) {
    const parentActive = linkIsActive(pathname, section.href);
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={parentActive} tooltip={section.label}>
                <Link to={section.href}>
                  <SidebarLinkIcon id={section.id} />
                  <span>{section.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuSub className="mx-0 translate-x-0 border-l border-sidebar-border px-2.5 py-0.5">
              {section.children.map((child) => (
                <SidebarMenuSubItem key={child.id}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={linkIsActive(pathname, child.href)}
                    className={SUB_ITEM_CLASS}
                  >
                    <Link to={child.href}>
                      <SidebarLinkIcon id={child.id} />
                      <span>{child.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {section.children.map((child) => (
            <NavLinkItem key={child.id} item={child} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

/** Render Sidebar from nav model. */
export function SidebarNav({ nav }: { nav: SidebarNavModel }) {
  return (
    <>
      {nav.topLinks.length > 0 ? (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.topLinks.map((item) => (
                <NavLinkItem key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ) : null}
      {nav.sections.map((section) => (
        <NavSection key={section.id} section={section} />
      ))}
    </>
  );
}
