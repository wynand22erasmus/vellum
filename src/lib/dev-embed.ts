/**
 * Embeds local dev infrastructure (Mailpit, Adminer, Prisma Studio) in `/dev/*` routes.
 *
 * @packageDocumentation
 */

import type { DevServiceLink } from '@/lib/dev-services.ts';
import type { SidebarLinkItem } from './sidebar-nav.ts';

const SKIP_EMBED_IDS = new Set(['app']);

const PROXY_IFRAME_IDS = new Set(['mailpit', 'minio-console', 'db-admin']);

/** Adminer runs in the postgres container; 127.0.0.1 is correct from its PHP process. */
const ADMINER_EMBED_QUERY = 'pgsql=127.0.0.1&username=vellum&db=vellum_db';

/** How a dev service is rendered inside the dashboard shell. */
export type DevEmbedMode = 'native-prisma' | 'native-webhooks' | 'same-origin-iframe' | 'proxy-iframe';

/**
 * Returns the in-app route for embedding a dev service.
 *
 * @param service - Dev service link metadata
 */
export function devServiceEmbedHref(service: DevServiceLink): string {
  return `/dev/${service.id}`;
}

/**
 * Looks up a dev service by id from the configured service list.
 *
 * @param serviceId - Dev service id (e.g. `mailpit`)
 * @param services - Available dev service links
 */
export function resolveDevServiceUrl(
  serviceId: string,
  services: DevServiceLink[],
): DevServiceLink | undefined {
  return services.find((service) => service.id === serviceId);
}

/**
 * Determines how a dev service should be embedded in the dashboard.
 *
 * @param serviceId - Dev service id
 */
export function devServiceEmbedMode(serviceId: string): DevEmbedMode {
  if (serviceId === 'prisma-studio') {
    return 'native-prisma';
  }
  if (serviceId === 'webhooks') {
    return 'native-webhooks';
  }
  if (serviceId === 'docs') {
    return 'same-origin-iframe';
  }
  if (PROXY_IFRAME_IDS.has(serviceId)) {
    return 'proxy-iframe';
  }
  return 'proxy-iframe';
}

/**
 * Resolves the iframe `src` URL for an embedded dev service.
 *
 * @param service - Dev service link metadata
 */
export function devServiceIframeSrc(service: DevServiceLink): string {
  const mode = devServiceEmbedMode(service.id);
  if (mode === 'same-origin-iframe') {
    return '/docs/';
  }
  if (mode === 'proxy-iframe') {
    if (service.id === 'db-admin') {
      return `/dev-proxy/db-admin/?${ADMINER_EMBED_QUERY}`;
    }
    return `/dev-proxy/${service.id}/`;
  }
  return service.url;
}

/**
 * Builds sidebar links for embeddable dev services (excludes the web app entry).
 *
 * @param services - Available dev service links
 */
export function buildDevServiceLinks(services: DevServiceLink[]): SidebarLinkItem[] {
  return services
    .filter((service) => !SKIP_EMBED_IDS.has(service.id))
    .map((service) => ({
      id: service.id,
      label: service.label,
      href: devServiceEmbedHref(service),
      embed: true,
      description: service.description,
    }));
}

/** True for routes like `/dev/mailpit` (embedded service, not the overview). */
export function isDevEmbedPath(pathname: string): boolean {
  return /^\/dev\/[^/]+$/.test(pathname);
}
