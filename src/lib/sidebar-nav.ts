/**
 * Sidebar menu tree builder (route-aware dev services and admin links).
 *
 * @packageDocumentation
 */

import type { AuthUser } from './auth/types.ts';
import type { DevServiceLink } from './dev-services.ts';
import { buildExperimentalLinks } from './experimental-services.ts';

export type SidebarLinkItem = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  /** Open in a new browser tab (e.g. API docs). */
  newTab?: boolean;
  /** Load inside the experimental iframe panel (in-app route). */
  embed?: boolean;
  description?: string;
};

export type SidebarNavItem = {
  id: string;
  label: string;
  href?: string;
  external?: boolean;
  newTab?: boolean;
  children?: SidebarLinkItem[];
};

const LANDING_ONLY_DEV_IDS = new Set(['minio-console']);
const LANDING_HIDDEN_DEV_IDS = new Set(['app']);
const INFRA_DEV_IDS = new Set([
  'mailpit',
  'minio-console',
  'prisma-studio',
  'db-admin',
]);

function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function filterDevServices(
  services: DevServiceLink[],
  pathname: string,
): DevServiceLink[] {
  const isLanding = pathname === '/';

  return services.filter((service) => {
    if (service.id === 'minio-api') {
      return false;
    }
    if (isLanding) {
      if (LANDING_HIDDEN_DEV_IDS.has(service.id)) {
        return false;
      }
      if (INFRA_DEV_IDS.has(service.id)) {
        return LANDING_ONLY_DEV_IDS.has(service.id);
      }
      return false;
    }
    if (service.id === 'docs') {
      return false;
    }
    return true;
  });
}

function devServiceToLink(service: DevServiceLink): SidebarLinkItem {
  const external = isExternalUrl(service.url);
  return {
    id: service.id,
    label: service.label,
    href: service.url,
    external,
    newTab: external || service.url.startsWith('/docs'),
    description: service.description,
  };
}

/**
 * Builds sidebar groups for the current route and user.
 */
export function buildSidebarNav(options: {
  pathname: string;
  user: AuthUser | null;
  devServices: DevServiceLink[];
}): SidebarNavItem[] {
  const { pathname, user, devServices } = options;
  const isAdmin = user?.kind === 'ADMIN';
  const isLanding = pathname === '/';
  const groups: SidebarNavItem[] = [];

  if (!user) {
    return groups;
  }

  const mainChildren: SidebarLinkItem[] = [
    { id: 'dashboard', label: 'Recipient dashboard', href: '/dashboard' },
  ];

  groups.push({
    id: 'main',
    label: 'Main',
    children: mainChildren,
  });

  if (isAdmin) {
    if (isLanding) {
      // Admin app links live under Dev services on the landing page.
    } else {
      groups.push({
        id: 'data-browser',
        label: 'Data browser',
        children: [
          { id: 'admin-overview', label: 'Overview', href: '/admin' },
          { id: 'admin-documents', label: 'Documents', href: '/admin/documents' },
          { id: 'admin-users', label: 'Users', href: '/admin/users' },
          { id: 'admin-audit', label: 'Audit logs', href: '/admin/audit-logs' },
          {
            id: 'admin-failed-audit',
            label: 'Failed audit',
            href: '/admin/failed-audit-logs',
          },
        ],
      });
      groups.push({
        id: 'api-docs',
        label: 'API documentation',
        href: '/docs/',
        newTab: true,
      });
    }
  }

  const filteredDev = filterDevServices(devServices, pathname);
  const devChildren: SidebarLinkItem[] = filteredDev.map(devServiceToLink);

  if (isAdmin && isLanding) {
    devChildren.unshift(
      { id: 'admin-app', label: 'Data browser', href: '/admin' },
      { id: 'admin-docs', label: 'API documentation', href: '/docs/', newTab: true },
    );
  }

  if (devChildren.length > 0) {
    groups.push({
      id: 'dev-services',
      label: 'Dev services',
      children: devChildren,
    });
  }

  const experimentalChildren = buildExperimentalLinks(devServices);
  if (experimentalChildren.length > 0) {
    groups.push({
      id: 'experimental',
      label: 'Experimental',
      children: experimentalChildren,
    });
  }

  return groups;
}

/**
 * Display name for the sidebar user panel.
 */
export function displayUserName(user: AuthUser): string {
  const parts = [user.firstName, user.lastName].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(' ');
  }
  return user.email;
}
