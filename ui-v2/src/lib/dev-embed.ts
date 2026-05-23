import type { DevServiceLink } from '@vellum/legacy-lib/dev-services.ts';
import type { SidebarLinkItem } from './sidebar-nav.ts';

const SKIP_EMBED_IDS = new Set(['app']);

const PROXY_IFRAME_IDS = new Set(['mailpit', 'minio-console', 'db-admin']);

/** Adminer runs in the postgres container; 127.0.0.1 is correct from its PHP process. */
const ADMINER_EMBED_QUERY = 'pgsql=127.0.0.1&username=vellum&db=vellum_db';

export type DevEmbedMode = 'native-prisma' | 'same-origin-iframe' | 'proxy-iframe';

export function devServiceEmbedHref(service: DevServiceLink): string {
  return `/dev/${service.id}`;
}

export function resolveDevServiceUrl(
  serviceId: string,
  services: DevServiceLink[],
): DevServiceLink | undefined {
  return services.find((service) => service.id === serviceId);
}

export function devServiceEmbedMode(serviceId: string): DevEmbedMode {
  if (serviceId === 'prisma-studio') {
    return 'native-prisma';
  }
  if (serviceId === 'docs') {
    return 'same-origin-iframe';
  }
  if (PROXY_IFRAME_IDS.has(serviceId)) {
    return 'proxy-iframe';
  }
  return 'proxy-iframe';
}

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
