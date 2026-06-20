/**
 * Sidebar menu tree builder (route-aware dev services and admin links).
 *
 * @packageDocumentation
 */

import type { AuthUser } from './auth.ts';
import type { DevServiceLink } from '@/lib/dev-services.ts';
import { buildDevServiceLinks } from './dev-embed.ts';
import { PAGE_LABELS } from './page-labels.ts';

/** Base sidebar navigation entry (leaf or section parent). */
export type SidebarNavEntry = {
  id: string;
  label: string;
  href?: string;
  embed?: boolean;
  description?: string;
  children?: SidebarNavEntry[];
};

/** Leaf nav item (always has `href`). */
export type SidebarLinkItem = SidebarNavEntry & { href: string };

/** Labeled sidebar block (Admin, Development) with optional parent link. */
export type SidebarNavSection = {
  id: string;
  label: string;
  /** When set, the section title row links here (e.g. Admin → `/admin` overview). */
  href?: string;
  children: SidebarLinkItem[];
};

/** Top-level links and grouped sections for the dashboard sidebar. */
export type SidebarNavModel = {
  topLinks: SidebarLinkItem[];
  sections: SidebarNavSection[];
};

const HIDDEN_DEV_IDS = new Set(['minio-api', 'app']);

/** Normalizes app paths to root-relative URLs. */
export function normalizeAppPath(path: string): string {
  if (!path || path === '/') return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

function filterDevServices(services: DevServiceLink[]): DevServiceLink[] {
  return services.filter((service) => !HIDDEN_DEV_IDS.has(service.id));
}

/**
 * Builds the sidebar navigation model for the current user and dev services.
 *
 * @param options - Session user and available dev service links
 */
export function buildSidebarNav(options: {
  user: AuthUser | null;
  devServices: DevServiceLink[];
}): SidebarNavModel {
  const { user, devServices } = options;
  const isAdmin = user?.kind === 'ADMIN';
  const path = normalizeAppPath;

  if (!user) {
    return { topLinks: [], sections: [] };
  }

  const topLinks: SidebarLinkItem[] = [
    {
      id: 'dashboard',
      label: PAGE_LABELS.dashboard.nav,
      href: path(PAGE_LABELS.dashboard.href!),
    },
  ];

  const sections: SidebarNavSection[] = [];

  if (isAdmin) {
    sections.push({
      id: 'admin',
      label: PAGE_LABELS.admin.nav,
      href: path(PAGE_LABELS.admin.href!),
      children: [
        {
          id: 'admin-document-files',
          label: PAGE_LABELS.adminDocumentFiles.nav,
          href: path(PAGE_LABELS.adminDocumentFiles.href!),
        },
        {
          id: 'admin-documents',
          label: PAGE_LABELS.adminDocuments.nav,
          href: path(PAGE_LABELS.adminDocuments.href!),
        },
        {
          id: 'admin-users',
          label: PAGE_LABELS.adminUsers.nav,
          href: path(PAGE_LABELS.adminUsers.href!),
        },
        {
          id: 'admin-audit',
          label: PAGE_LABELS.adminAuditLogs.nav,
          href: path(PAGE_LABELS.adminAuditLogs.href!),
        },
        {
          id: 'admin-failed-audit',
          label: PAGE_LABELS.adminFailedAuditLogs.nav,
          href: path(PAGE_LABELS.adminFailedAuditLogs.href!),
        },
        {
          id: 'admin-process-errors',
          label: PAGE_LABELS.adminProcessErrors.nav,
          href: path(PAGE_LABELS.adminProcessErrors.href!),
        },
        {
          id: 'admin-failed-process-errors',
          label: PAGE_LABELS.adminFailedProcessErrors.nav,
          href: path(PAGE_LABELS.adminFailedProcessErrors.href!),
        },
        {
          id: 'admin-webhook-deliveries',
          label: PAGE_LABELS.adminWebhookDeliveries.nav,
          href: path(PAGE_LABELS.adminWebhookDeliveries.href!),
        },
        {
          id: 'admin-failed-webhook-deliveries',
          label: PAGE_LABELS.adminFailedWebhookDeliveries.nav,
          href: path(PAGE_LABELS.adminFailedWebhookDeliveries.href!),
        },
      ],
    });

    const devChildren = buildDevServiceLinks(filterDevServices(devServices)).map((child) => ({
      ...child,
      href: path(child.href),
    }));
    if (devChildren.length > 0) {
      sections.push({
        id: 'development',
        label: PAGE_LABELS.development.nav,
        href: path(PAGE_LABELS.development.href!),
        children: devChildren,
      });
    }
  }

  return { topLinks, sections };
}

/**
 * Formats a display name from profile fields, falling back to email.
 *
 * @param user - Authenticated dashboard user
 */
export function displayUserName(user: AuthUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(' ');
  }
  return user.email;
}
