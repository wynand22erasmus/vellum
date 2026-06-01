/**
 * Lucide icons for collapsed sidebar nav items (keyed by link id).
 *
 * @packageDocumentation
 */

import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  AppWindow,
  BookOpen,
  Construction,
  Database,
  FileText,
  Globe,
  HardDrive,
  LayoutDashboard,
  LogIn,
  Mail,
  ScrollText,
  Users,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  login: LogIn,
  dashboard: LayoutDashboard,
  admin: Database,
  development: Construction,
  'admin-documents': FileText,
  'admin-users': Users,
  'admin-audit': ScrollText,
  'admin-failed-audit': AlertTriangle,
  'admin-app': Database,
  'admin-docs': BookOpen,
  docs: BookOpen,
  mailpit: Mail,
  'minio-console': HardDrive,
  'prisma-studio': Database,
  'db-admin': Database,
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
