/**
 * Renders a sidebar nav icon by link id (avoids dynamic component JSX in parents).
 *
 * @packageDocumentation
 */

import { createElement } from 'react';
import { sidebarLinkIcon } from '../lib/sidebar-icons.ts';

type SidebarLinkIconProps = {
  id: string;
  className?: string;
};

/** Lucide icon for a sidebar link id. */
export function SidebarLinkIcon({ id, className = 'size-4 shrink-0' }: SidebarLinkIconProps) {
  return createElement(sidebarLinkIcon(id), { className, 'aria-hidden': true });
}
