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
  DatabaseZap,
  FileText,
  FileWarning,
  Globe,
  HardDrive,
  LayoutDashboard,
  Link2,
  LogIn,
  Mail,
  ScrollText,
  ShieldCheck,
  Table2,
  Terminal,
  UserRound,
  Users,
  Webhook,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  login: LogIn,
  dashboard: LayoutDashboard,
  admin: ShieldCheck,
  'admin-files': HardDrive,
  'admin-documents': FileText,
  'admin-recipients': UserRound,
  'admin-communications': Link2,
  'admin-users': Users,
  'admin-audit': ScrollText,
  'admin-dead-letters': FileWarning,
  'admin-process-errors': Bug,
  'admin-webhook-deliveries': Webhook,
  development: Terminal,
  docs: Braces,
  mailpit: Mail,
  webhooks: Webhook,
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
