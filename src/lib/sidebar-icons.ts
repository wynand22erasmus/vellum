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
  Database,
  FileText,
  Globe,
  HardDrive,
  LayoutDashboard,
  LogIn,
  Mail,
  ScrollText,
  Users,
  Wrench,
  FlaskConical,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  login: LogIn,
  dashboard: LayoutDashboard,
  'admin-overview': LayoutDashboard,
  'admin-documents': FileText,
  'admin-users': Users,
  'admin-audit': ScrollText,
  'admin-failed-audit': AlertTriangle,
  'admin-app': Database,
  'admin-docs': BookOpen,
  'api-docs': BookOpen,
  docs: BookOpen,
  mailpit: Mail,
  'minio-console': HardDrive,
  'prisma-studio': Database,
  'db-admin': Database,
  app: AppWindow,
  'dev-services': Wrench,
  main: LayoutDashboard,
  'data-browser': Database,
  experimental: FlaskConical,
};

/** Icon for a sidebar link or group id. */
export function sidebarLinkIcon(id: string): LucideIcon {
  return ICONS[id] ?? Globe;
}
