/**
 * Sidebar navigation groups driven by the nav model.
 *
 * @packageDocumentation
 */

import { NavLink, useLocation } from 'react-router-dom';
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
  if (href === '/dashboard' || href === '/admin' || href === '/dev') {
    return pathname === href;
  }
  if (href.startsWith('/dev/')) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinkItem({ item }: { item: SidebarLinkItem }) {
  const { pathname } = useLocation();
  const isActive = linkIsActive(pathname, item.href);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
        <NavLink
          to={item.href}
          end={item.href === '/dashboard' || item.href === '/admin' || item.href === '/dev'}
        >
          <SidebarLinkIcon id={item.id} />
          <span>{item.label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function NavSection({ section }: { section: SidebarNavSection }) {
  const { pathname } = useLocation();

  if (section.href) {
    const parentActive = linkIsActive(pathname, section.href);
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={parentActive} tooltip={section.label}>
                <NavLink to={section.href} end>
                  <SidebarLinkIcon id={section.id} />
                  <span>{section.label}</span>
                </NavLink>
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
                    <NavLink to={child.href} end={child.href.startsWith('/dev/')}>
                      <SidebarLinkIcon id={child.id} />
                      <span>{child.label}</span>
                    </NavLink>
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

/** Render top links and nested sections from a sidebar navigation model. */
export function VellumSidebarNav({ nav }: { nav: SidebarNavModel }) {
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
