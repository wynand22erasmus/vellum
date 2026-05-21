/**
 * Collapsible sidebar navigation group with persisted open state.
 *
 * @packageDocumentation
 */

import { ChevronDown } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils.ts';
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

function childLinkClassName({ isActive }: { isActive: boolean }): string {
  return cn(
    'block rounded-md px-2 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
  );
}

function staticLinkClassName(): string {
  return 'block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';
}

function isSpaRoute(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('/docs');
}

function SidebarChildLink({ item }: { item: SidebarLinkItem }) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={staticLinkClassName()}
      >
        {item.label}
      </a>
    );
  }

  if (!isSpaRoute(item.href)) {
    return (
      <a href={item.href} className={staticLinkClassName()}>
        {item.label}
      </a>
    );
  }

  return (
    <NavLink to={item.href} end={item.href === '/' || item.href === '/admin'} className={childLinkClassName}>
      {item.label}
    </NavLink>
  );
}

type SidebarNavGroupProps = {
  id: string;
  label: string;
  children: SidebarLinkItem[];
  defaultOpen?: boolean;
};

/** Collapsible parent with child links (internal routes or external URLs). */
export function SidebarNavGroup({
  id,
  label,
  children,
  defaultOpen = true,
}: SidebarNavGroupProps) {
  const panelId = useId();
  const [open, setOpen] = useState(() => readStoredOpen(id, defaultOpen));

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey(id), String(open));
    } catch {
      // ignore
    }
  }, [id, open]);

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
              <SidebarChildLink item={item} />
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
};

/** Single top-level sidebar link (e.g. API documentation on non-landing routes). */
export function SidebarNavSingleLink({ label, href }: SidebarNavSingleLinkProps) {
  if (!isSpaRoute(href)) {
    return (
      <a href={href} className={staticLinkClassName()}>
        {label}
      </a>
    );
  }

  return (
    <NavLink to={href} className={childLinkClassName}>
      {label}
    </NavLink>
  );
}
