/**
 * Builds breadcrumb segments from pathname and sidebar navigation model.
 *
 * @packageDocumentation
 */

import type { SidebarLinkItem, SidebarNavModel, SidebarNavSection } from './sidebar-nav';
import { PAGE_LABELS, pageLabelForPath, trailLabel } from './page-labels';

/** One segment in the header breadcrumb trail. */
export type TrailSegment = {
  label: string;
  href?: string;
};

const HOME_SEGMENT: TrailSegment = {
  label: trailLabel(PAGE_LABELS.dashboard),
  href: PAGE_LABELS.dashboard.href,
};

function withHome(segments: TrailSegment[]): TrailSegment[] {
  return [HOME_SEGMENT, ...segments];
}

function matchesPath(pathname: string, href: string): boolean {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  if (href === '/admin') {
    return pathname === '/admin';
  }
  if (href === '/dev') {
    return pathname === '/dev';
  }
  if (href.startsWith('/dev/')) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function sectionTrailSegment(section: SidebarNavSection): TrailSegment {
  return section.href
    ? { label: section.label, href: section.href }
    : { label: section.label };
}

function trailFromSection(pathname: string, section: SidebarNavSection): TrailSegment[] | null {
  if (section.href && matchesPath(pathname, section.href)) {
    return withHome([{ label: section.label }]);
  }

  for (const child of section.children) {
    if (matchesPath(pathname, child.href)) {
      return withHome([sectionTrailSegment(section), { label: child.label, href: child.href }]);
    }
  }

  return null;
}

function trailFromModel(pathname: string, model: SidebarNavModel): TrailSegment[] | null {
  for (const link of model.topLinks) {
    if (matchesPath(pathname, link.href)) {
      if (link.href === '/dashboard') {
        return [{ label: trailLabel(PAGE_LABELS.dashboard) }];
      }
      return withHome([{ label: link.label, href: link.href }]);
    }
  }

  for (const section of model.sections) {
    const trail = trailFromSection(pathname, section);
    if (trail) {
      return trail;
    }
  }

  return null;
}

const STATIC_TRAILS: Record<string, TrailSegment[]> = {
  '/login': [{ label: PAGE_LABELS.signIn.nav }],
  '/login/email-verification': [
    { label: PAGE_LABELS.signIn.nav, href: '/login' },
    { label: PAGE_LABELS.emailVerification.nav },
  ],
};

const ADMIN_SECTION_LABELS: Record<string, string> = {
  documents: PAGE_LABELS.adminDocuments.nav,
  users: PAGE_LABELS.adminUsers.nav,
  'audit-logs': PAGE_LABELS.adminAuditLogs.nav,
  'failed-audit-logs': PAGE_LABELS.adminFailedAuditLogs.nav,
};

/**
 * Resolves header breadcrumb segments for the current pathname.
 *
 * @param pathname - Current URL pathname
 * @param model - Sidebar navigation model
 */
export function resolveNavTrail(pathname: string, model: SidebarNavModel): TrailSegment[] {
  const staticTrail = STATIC_TRAILS[pathname];
  if (staticTrail) {
    return staticTrail;
  }

  if (/^\/verify\/[^/]+\/complete$/.test(pathname)) {
    const token = pathname.split('/')[2];
    return [
      { label: PAGE_LABELS.secureDownload.nav, href: `/verify/${token}` },
      { label: PAGE_LABELS.secureDownloadComplete.nav },
    ];
  }

  if (pathname.startsWith('/verify/')) {
    return [{ label: PAGE_LABELS.secureDownload.nav }];
  }

  const fromNav = trailFromModel(pathname, model);
  if (fromNav) {
    return fromNav;
  }

  const adminMatch = /^\/admin\/([^/]+)\/([^/]+)$/.exec(pathname);
  if (adminMatch) {
    const [, section] = adminMatch;
    const sectionHref = `/admin/${section}`;
    const sectionLabel = ADMIN_SECTION_LABELS[section] ?? section;
    return withHome([
      { label: PAGE_LABELS.admin.nav, href: PAGE_LABELS.admin.href },
      { label: sectionLabel, href: sectionHref },
      { label: PAGE_LABELS.adminDocumentDetail.nav },
    ]);
  }

  if (pathname === '/dashboard' || pathname === '/') {
    return [{ label: trailLabel(PAGE_LABELS.dashboard) }];
  }

  const pageLabel = pageLabelForPath(pathname);
  if (pageLabel) {
    if (pathname === '/admin') {
      return withHome([{ label: PAGE_LABELS.admin.nav }]);
    }
    if (pathname === '/dev') {
      return withHome([{ label: PAGE_LABELS.development.nav }]);
    }
    if (pathname.startsWith('/admin/')) {
      return withHome([
        { label: PAGE_LABELS.admin.nav, href: PAGE_LABELS.admin.href },
        { label: pageLabel.nav, href: pageLabel.href },
      ]);
    }
  }

  return [{ label: 'Vellum' }];
}

/**
 * Finds a dev service sidebar link by service id.
 *
 * @param serviceId - Dev service id (e.g. `mailpit`)
 * @param model - Sidebar navigation model
 */
export function findDevServiceLink(
  serviceId: string,
  model: SidebarNavModel,
): SidebarLinkItem | undefined {
  const targetHref = `/dev/${serviceId}`;
  const development = model.sections.find((section) => section.id === 'development');
  return development?.children.find((child) => child.href === targetHref);
}
