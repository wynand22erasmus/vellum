/**
 * Maps Vellum sidebar nav groups to shadcn sidebar-08 menu primitives.
 *
 * @packageDocumentation
 */

import { NavLink, useLocation } from 'react-router-dom';
import { SidebarLinkIcon } from './sidebar-link-icon.tsx';
import type { SidebarLinkItem, SidebarNavItem } from '../lib/sidebar-nav.ts';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar.tsx';

function isSpaRoute(href: string): boolean {
  return href.startsWith('/experimental') || (href.startsWith('/') && !href.startsWith('/docs'));
}

function opensNewTab(item: SidebarLinkItem): boolean {
  if (item.embed) {
    return false;
  }
  return item.newTab === true || item.external === true || item.href.startsWith('/docs');
}

function linkIsActive(pathname: string, href: string): boolean {
  if (href === '/dashboard' || href === '/admin') {
    return pathname === href || (href === '/admin' && pathname.startsWith('/admin/'));
  }
  if (href.startsWith('/experimental/')) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinkItem({ item }: { item: SidebarLinkItem }) {
  const { pathname } = useLocation();
  const isActive = linkIsActive(pathname, item.href);

  if (opensNewTab(item)) {
    return (
      <SidebarMenuButton asChild tooltip={item.label}>
        <a href={item.href} target="_blank" rel="noopener noreferrer">
          <SidebarLinkIcon id={item.id} />
          <span>{item.label}</span>
        </a>
      </SidebarMenuButton>
    );
  }

  if (!isSpaRoute(item.href)) {
    return (
      <SidebarMenuButton asChild tooltip={item.label}>
        <a href={item.href}>
          <SidebarLinkIcon id={item.id} />
          <span>{item.label}</span>
        </a>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
      <NavLink
        to={item.href}
        end={
          item.href === '/dashboard' ||
          item.href === '/admin' ||
          item.href.startsWith('/experimental/')
        }
      >
        <SidebarLinkIcon id={item.id} />
        <span>{item.label}</span>
      </NavLink>
    </SidebarMenuButton>
  );
}

type VellumSidebarNavProps = {
  groups: SidebarNavItem[];
};

/** Renders configured nav groups inside {@link SidebarContent}. */
export function VellumSidebarNav({ groups }: VellumSidebarNavProps) {
  return (
    <>
      {groups.map((group) =>
        group.children ? (
          <SidebarGroup key={group.id}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.children.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <NavLinkItem item={item} />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : group.href ? (
          <SidebarGroup key={group.id}>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavLinkItem
                    item={{
                      id: group.id,
                      label: group.label,
                      href: group.href,
                      newTab: group.newTab,
                    }}
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null,
      )}
    </>
  );
}
