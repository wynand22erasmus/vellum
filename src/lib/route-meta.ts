/**
 * Resolves header breadcrumb trail and subheader copy for the active route.
 *
 * @packageDocumentation
 */

import { findDevServiceLink, resolveNavTrail, type TrailSegment } from './nav-trail';
import { PAGE_LABELS, pageLabelForPath } from './page-labels';
import type { SidebarNavModel } from './sidebar-nav';

/** Optional page subheader shown below the breadcrumb trail. */
export type PageSubheader = {
  description: string;
  /** Dev service external URL for “Open in new tab”. */
  externalUrl?: string;
};

function adminDetailMeta(pathname: string): PageSubheader | null {
  if (!/^\/admin\/documents\/[^/]+$/.test(pathname)) {
    return null;
  }
  return {
    description: PAGE_LABELS.adminDocumentDetail.description,
  };
}

/**
 * Resolves breadcrumb trail and subheader for the current route.
 *
 * @param pathname - Current URL pathname
 * @param nav - Sidebar navigation model
 * @param options - Optional dev-service overrides for embedded routes
 */
export function resolveRouteHeader(
  pathname: string,
  nav: SidebarNavModel,
  options?: {
    devServiceId?: string;
    devServiceDescription?: string;
    devServiceExternalUrl?: string;
  },
): { trail: TrailSegment[]; subheader: PageSubheader | null } {
  const trail = resolveNavTrail(pathname, nav);

  if (options?.devServiceId) {
    const description =
      options.devServiceDescription ??
      findDevServiceLink(options.devServiceId, nav)?.description ??
      '';
    if (!description) {
      return { trail, subheader: null };
    }
    return {
      trail,
      subheader: {
        description,
        externalUrl: options.devServiceExternalUrl,
      },
    };
  }

  const detail = adminDetailMeta(pathname);
  if (detail) {
    return { trail, subheader: detail };
  }

  const pageLabel = pageLabelForPath(pathname);
  if (pageLabel) {
    return { trail, subheader: { description: pageLabel.description } };
  }

  return { trail, subheader: null };
}
