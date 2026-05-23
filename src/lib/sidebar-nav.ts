import type { AuthUser } from './auth.ts';
import type { DevServiceLink } from '@/lib/dev-services.ts';
import { buildDevServiceLinks } from './dev-embed.ts';
import { PAGE_LABELS } from './page-labels.ts';

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

export type SidebarNavModel = {
  topLinks: SidebarLinkItem[];
  sections: SidebarNavSection[];
};

/** @deprecated Use {@link SidebarNavModel} */
export type SidebarNavItem = SidebarNavEntry;

const HIDDEN_DEV_IDS = new Set(['minio-api', 'app']);

function filterDevServices(services: DevServiceLink[]): DevServiceLink[] {
  return services.filter((service) => !HIDDEN_DEV_IDS.has(service.id));
}

export function buildSidebarNav(options: {
  pathname: string;
  user: AuthUser | null;
  devServices: DevServiceLink[];
}): SidebarNavModel {
  const { user, devServices } = options;
  const isAdmin = user?.kind === 'ADMIN';

  if (!user) {
    return { topLinks: [], sections: [] };
  }

  const topLinks: SidebarLinkItem[] = [
    {
      id: 'dashboard',
      label: PAGE_LABELS.dashboard.nav,
      href: PAGE_LABELS.dashboard.href!,
    },
  ];

  const sections: SidebarNavSection[] = [];

  if (isAdmin) {
    sections.push({
      id: 'admin',
      label: PAGE_LABELS.admin.nav,
      href: PAGE_LABELS.admin.href,
      children: [
        {
          id: 'admin-documents',
          label: PAGE_LABELS.adminDocuments.nav,
          href: PAGE_LABELS.adminDocuments.href!,
        },
        {
          id: 'admin-users',
          label: PAGE_LABELS.adminUsers.nav,
          href: PAGE_LABELS.adminUsers.href!,
        },
        {
          id: 'admin-audit',
          label: PAGE_LABELS.adminAuditLogs.nav,
          href: PAGE_LABELS.adminAuditLogs.href!,
        },
        {
          id: 'admin-failed-audit',
          label: PAGE_LABELS.adminFailedAuditLogs.nav,
          href: PAGE_LABELS.adminFailedAuditLogs.href!,
        },
      ],
    });

    const devChildren = buildDevServiceLinks(filterDevServices(devServices));
    if (devChildren.length > 0) {
      sections.push({
        id: 'development',
        label: PAGE_LABELS.development.nav,
        href: PAGE_LABELS.development.href,
        children: devChildren,
      });
    }
  }

  return { topLinks, sections };
}

export function displayUserName(user: AuthUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(' ');
  }
  return user.email;
}
