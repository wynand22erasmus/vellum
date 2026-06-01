/**
 * Map sidebar link ids to Lucide icons.
 *
 * @packageDocumentation
 */

import { createElement } from 'react';
import { sidebarLinkIcon } from '@/lib/sidebar-icons';

/** Render the icon registered for a sidebar navigation link id. */
export function SidebarLinkIcon({ id, className = 'size-4 shrink-0' }: { id: string; className?: string }) {
  return createElement(sidebarLinkIcon(id), { className, 'aria-hidden': true });
}
