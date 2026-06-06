/**
 * Lucide icons for collapsed sidebar nav items (keyed by link id).
 *
 * @packageDocumentation
 */

import type { LucideIcon } from 'lucide-react';
import {
  AppWindow,
  Braces,
  Bug,
  BugOff,
  DatabaseZap,
  FileText,
  FileWarning,
  Globe,
  HardDrive,
  LayoutDashboard,
  LogIn,
  Mail,
  ScrollText,
  ShieldCheck,
  Table2,
  Terminal,
  Users,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  login: LogIn,
  dashboard: LayoutDashboard,
  admin: ShieldCheck,
  'admin-documents': FileText,
  'admin-users': Users,
  'admin-audit': ScrollText,
  'admin-failed-audit': FileWarning,
  'admin-process-errors': Bug,
  'admin-failed-process-errors': BugOff,
  development: Terminal,
  docs: Braces,
  mailpit: Mail,
  'minio-console': HardDrive,
  'prisma-studio': Table2,
  'db-admin': DatabaseZap,
  app: AppWindow,
};

/**
 * Returns the Lucide icon for a sidebar link id, defaulting to `Globe`.
 *
 * @param id - Sidebar link id
 */
export function sidebarLinkIcon(id: string): LucideIcon {
  return ICONS[id] ?? Globe;
}
