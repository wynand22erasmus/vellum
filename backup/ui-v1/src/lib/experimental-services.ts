/**
 * Experimental in-app embeds for web-reachable dev services.
 *
 * @packageDocumentation
 */

import type { DevServiceLink } from './dev-services.ts';
import type { SidebarLinkItem } from './sidebar-nav.ts';

/** Dev service ids that must not be embedded (same-origin app shell). */
const SKIP_EMBED_IDS = new Set(['app']);

/**
 * Web UI services from the dev stack, mapped to in-app experimental routes.
 */
export function buildExperimentalLinks(services: DevServiceLink[]): SidebarLinkItem[] {
  return services
    .filter((service) => !SKIP_EMBED_IDS.has(service.id))
    .map((service) => ({
      id: service.id,
      label: service.label,
      href: `/experimental/${service.id}`,
      embed: true,
      description: service.description,
    }));
}

/**
 * Resolves an experimental route id to the iframe target URL.
 */
export function resolveExperimentalUrl(
  serviceId: string,
  services: DevServiceLink[],
): DevServiceLink | undefined {
  return services.find((service) => service.id === serviceId);
}
