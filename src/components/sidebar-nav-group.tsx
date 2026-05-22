/**
 * Collapsible sidebar navigation group with persisted open state.
 *
 * @packageDocumentation
 */

import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
import { sidebarLinkIcon } from '../lib/sidebar-icons.ts';
import type { SidebarLinkItem } from '../lib/sidebar-nav.ts';

function storageKey(groupId: string): string {
  return `vellum_sidebar_${groupId}_open`;
}

function readStoredOpen(groupId: string, defaultOpen: boolean): boolean {
  try {
    const raw = sessionStorage.getItem(storageKey(groupId));
    if (raw === 'true') {
      return true;
    }
    if (raw === 'false') {
      return false;
    }
  } catch {
    // ignore
  }
  return defaultOpen;
}

function childLinkClassName({ isActive }: { isActive: boolean }, collapsed: boolean): string {
  return cn(
    collapsed
      ? 'flex h-9 w-9 items-center justify-center rounded-md transition-colors'
      : 'block rounded-md px-2 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
  );
}

function staticLinkClassName(collapsed: boolean): string {
  return cn(
    collapsed
      ? 'flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      : 'block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
  );
}

function isSpaRoute(href: string): boolean {
  return href.startsWith('/experimental') || (href.startsWith('/') && !href.startsWith('/docs'));
}

function opensNewTab(item: SidebarLinkItem): boolean {
  if (item.embed) {
    return false;
  }
  return item.newTab === true || item.external === true || item.href.startsWith('/docs');
}

type SidebarChildLinkProps = {
  item: SidebarLinkItem;
  collapsed: boolean;
};

function SidebarChildLink({ item, collapsed }: SidebarChildLinkProps) {
  const Icon = sidebarLinkIcon(item.id);
  const label = collapsed ? (
    <Icon className="h-4 w-4 shrink-0" aria-hidden />
  ) : (
    item.label
  );

  const linkProps = collapsed
    ? { title: item.label, 'aria-label': item.label }
    : {};

  if (opensNewTab(item)) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={staticLinkClassName(collapsed)}
        {...linkProps}
      >
        {label}
      </a>
    );
  }

  if (!isSpaRoute(item.href)) {
    return (
      <a href={item.href} className={staticLinkClassName(collapsed)} {...linkProps}>
        {label}
      </a>
    );
  }

  return (
    <NavLink
      to={item.href}
      end={
        item.href === '/dashboard' ||
        item.href === '/admin' ||
        item.href.startsWith('/experimental/')
      }
      className={(state) => childLinkClassName(state, collapsed)}
      {...linkProps}
    >
      {label}
    </NavLink>
  );
}

type SidebarNavGroupProps = {
  id: string;
  label: string;
  children: SidebarLinkItem[];
  defaultOpen?: boolean;
  collapsed?: boolean;
};

/** Collapsible parent with child links (internal routes or external URLs). */
export function SidebarNavGroup({
  id,
  label,
  children,
  defaultOpen = true,
  collapsed = false,
}: SidebarNavGroupProps) {
  const panelId = useId();
  const [open, setOpen] = useState(() => readStoredOpen(id, defaultOpen));

  useEffect(() => {
    if (collapsed) {
      return;
    }
    try {
      sessionStorage.setItem(storageKey(id), String(open));
    } catch {
      // ignore
    }
  }, [id, open, collapsed]);

  if (collapsed) {
    return (
      <ul className="flex flex-col items-center gap-1">
        {children.map((item) => (
          <li key={item.id}>
            <SidebarChildLink item={item} collapsed />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        className="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm font-medium hover:bg-sidebar-accent"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 transition-transform', !open && '-rotate-90')}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate">{label}</span>
      </button>
      {open ? (
        <ul id={panelId} className="flex flex-col gap-0.5 pl-5">
          {children.map((item) => (
            <li key={item.id}>
              <SidebarChildLink item={item} collapsed={false} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type SidebarNavSingleLinkProps = {
  label: string;
  href: string;
  newTab?: boolean;
  id?: string;
  collapsed?: boolean;
};

/** Single top-level sidebar link (e.g. API documentation on non-landing routes). */
export function SidebarNavSingleLink({
  label,
  href,
  newTab,
  id = 'api-docs',
  collapsed = false,
}: SidebarNavSingleLinkProps) {
  const Icon = sidebarLinkIcon(id);
  const content = collapsed ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : label;
  const linkProps = collapsed ? { title: label, 'aria-label': label } : {};

  if (newTab || href.startsWith('/docs') || !isSpaRoute(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={staticLinkClassName(collapsed)}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={href}
      className={(state) => childLinkClassName(state, collapsed)}
      {...linkProps}
    >
      {content}
    </NavLink>
  );
}
