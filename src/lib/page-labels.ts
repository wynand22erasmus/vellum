/**
 * Human-readable nav, breadcrumb, and page descriptions keyed by route.
 *
 * @packageDocumentation
 */

/** Nav label, optional breadcrumb override, and page copy for a dashboard route. */
export type PageLabel = {
  nav: string;
  /** Breadcrumb label when different from nav (e.g. Dashboard → Home). */
  trail?: string;
  description: string;
  /** Centered auth card copy when it adds detail beyond the trail. */
  panelDescription?: string;
  href?: string;
};

/** Canonical labels and descriptions for known dashboard and auth routes. */
export const PAGE_LABELS = {
  dashboard: {
    nav: 'Dashboard',
    trail: 'Home',
    description:
      'Documents addressed to you. Request a new access link — downloads always require the email link and file password.',
    href: '/dashboard',
  },
  admin: {
    nav: 'Admin',
    description:
      'Read-only views of Postgres data. Secrets (download tokens, password hashes, object keys) are never shown.',
    href: '/admin',
  },
  adminDocuments: {
    nav: 'Document links',
    description: 'Per-recipient download links, passwords, and lifecycle state.',
    href: '/admin/documents',
  },
  adminDocumentFiles: {
    nav: 'Document files',
    description: 'Shared file assets in object storage (deduplicated by SHA-256).',
    href: '/admin/document-files',
  },
  adminUsers: {
    nav: 'Users',
    description: 'Dashboard accounts and roles.',
    href: '/admin/users',
  },
  adminAuditLogs: {
    nav: 'Audit logs',
    description: 'Compliance events with optional filters.',
    href: '/admin/audit-logs',
  },
  adminFailedAuditLogs: {
    nav: 'Failed audit logs',
    description: 'Dead-letter payloads when audit enqueue fails.',
    href: '/admin/failed-audit-logs',
  },
  adminProcessErrors: {
    nav: 'Process errors',
    description: 'RFC 9457 operational failures from HTTP, workers, and queues.',
    href: '/admin/process-errors',
  },
  adminFailedProcessErrors: {
    nav: 'Failed process errors',
    description: 'Dead-letter payloads when process-error enqueue fails.',
    href: '/admin/failed-process-errors',
  },
  adminWebhookDeliveries: {
    nav: 'Webhook deliveries',
    description: 'Outbound audit webhook HTTP attempts.',
    href: '/admin/webhook-deliveries',
  },
  adminFailedWebhookDeliveries: {
    nav: 'Failed webhook deliveries',
    description: 'Dead-letter payloads when webhook delivery exhausts retries.',
    href: '/admin/failed-webhook-deliveries',
  },
  adminDocumentFileDetail: {
    nav: 'Document file detail',
    description: 'Shared file metadata and linked recipient rows.',
  },
  adminDocumentDetail: {
    nav: 'Document detail',
    description: 'Document metadata and audit trail for this upload.',
  },
  development: {
    nav: 'Development',
    description: 'Local infrastructure and tooling for debugging and development.',
    href: '/dev',
  },
  devWebhooks: {
    nav: 'Webhook inspector',
    description: 'Outbound audit webhook delivery attempts (dev only).',
    href: '/dev/webhooks',
  },
  signIn: {
    nav: 'Sign in',
    description: 'Sign in to access your documents.',
  },
  emailVerification: {
    nav: 'Email verification',
    description: 'Check your inbox for a verification link.',
  },
  secureDownload: {
    nav: 'Secure download',
    description: 'Enter the file password to download your document.',
  },
  devLogin: {
    nav: 'Dev login',
    description: 'Development sign-in with email verification.',
    panelDescription:
      'Enter your email to access the dashboard. You must verify your address before signing in.',
  },
  verifyEmail: {
    nav: 'Verify your email',
    description: 'Complete email verification to continue.',
    panelDescription:
      'We sent a verification message to your inbox. Confirm your email address, then return here to sign in.',
  },
  secureDocumentDownload: {
    nav: 'Secure document download',
    description: 'Enter the file password from your email.',
    panelDescription:
      'Enter the file password you received separately. If your download does not start, log in to your Vellum dashboard to request a new link.',
  },
  secureDownloadComplete: {
    nav: 'Download complete',
    description: 'Your document download has finished.',
    panelDescription:
      'Your file download started successfully. You can close this browser tab when you are done.',
  },
} as const satisfies Record<string, PageLabel>;

/** Admin overview tiles linking to each admin sub-section. */
export const ADMIN_INDEX_TILES = [
  {
    id: 'admin-document-files',
    href: PAGE_LABELS.adminDocumentFiles.href!,
    label: PAGE_LABELS.adminDocumentFiles.nav,
    description: PAGE_LABELS.adminDocumentFiles.description,
  },
  {
    id: 'admin-documents',
    href: PAGE_LABELS.adminDocuments.href!,
    label: PAGE_LABELS.adminDocuments.nav,
    description: PAGE_LABELS.adminDocuments.description,
  },
  {
    id: 'admin-users',
    href: PAGE_LABELS.adminUsers.href!,
    label: PAGE_LABELS.adminUsers.nav,
    description: PAGE_LABELS.adminUsers.description,
  },
  {
    id: 'admin-audit',
    href: PAGE_LABELS.adminAuditLogs.href!,
    label: PAGE_LABELS.adminAuditLogs.nav,
    description: PAGE_LABELS.adminAuditLogs.description,
  },
  {
    id: 'admin-failed-audit',
    href: PAGE_LABELS.adminFailedAuditLogs.href!,
    label: PAGE_LABELS.adminFailedAuditLogs.nav,
    description: PAGE_LABELS.adminFailedAuditLogs.description,
  },
  {
    id: 'admin-process-errors',
    href: PAGE_LABELS.adminProcessErrors.href!,
    label: PAGE_LABELS.adminProcessErrors.nav,
    description: PAGE_LABELS.adminProcessErrors.description,
  },
  {
    id: 'admin-failed-process-errors',
    href: PAGE_LABELS.adminFailedProcessErrors.href!,
    label: PAGE_LABELS.adminFailedProcessErrors.nav,
    description: PAGE_LABELS.adminFailedProcessErrors.description,
  },
  {
    id: 'admin-webhook-deliveries',
    href: PAGE_LABELS.adminWebhookDeliveries.href!,
    label: PAGE_LABELS.adminWebhookDeliveries.nav,
    description: PAGE_LABELS.adminWebhookDeliveries.description,
  },
  {
    id: 'admin-failed-webhook-deliveries',
    href: PAGE_LABELS.adminFailedWebhookDeliveries.href!,
    label: PAGE_LABELS.adminFailedWebhookDeliveries.nav,
    description: PAGE_LABELS.adminFailedWebhookDeliveries.description,
  },
] as const;

const PAGE_LABEL_BY_PATH: Record<string, PageLabel> = {
  '/dashboard': PAGE_LABELS.dashboard,
  '/admin': PAGE_LABELS.admin,
  '/dev': PAGE_LABELS.development,
  '/admin/documents': PAGE_LABELS.adminDocuments,
  '/admin/document-files': PAGE_LABELS.adminDocumentFiles,
  '/admin/users': PAGE_LABELS.adminUsers,
  '/admin/audit-logs': PAGE_LABELS.adminAuditLogs,
  '/admin/failed-audit-logs': PAGE_LABELS.adminFailedAuditLogs,
  '/admin/process-errors': PAGE_LABELS.adminProcessErrors,
  '/admin/failed-process-errors': PAGE_LABELS.adminFailedProcessErrors,
  '/admin/webhook-deliveries': PAGE_LABELS.adminWebhookDeliveries,
  '/admin/failed-webhook-deliveries': PAGE_LABELS.adminFailedWebhookDeliveries,
};

/**
 * Resolves page label metadata for a pathname, including verify-flow routes.
 *
 * @param pathname - Current URL pathname
 */
export function pageLabelForPath(pathname: string): PageLabel | null {
  if (/^\/verify\/[^/]+\/complete$/.test(pathname)) {
    return PAGE_LABELS.secureDownloadComplete;
  }
  if (/^\/verify\/[^/]+$/.test(pathname)) {
    return PAGE_LABELS.secureDocumentDownload;
  }
  return PAGE_LABEL_BY_PATH[pathname] ?? null;
}

/**
 * Returns the breadcrumb label for a page (falls back to `nav`).
 *
 * @param label - Page label metadata
 */
export function trailLabel(label: PageLabel): string {
  return label.trail ?? label.nav;
}

/**
 * Returns auth-card description copy (falls back to page `description`).
 *
 * @param label - Page label metadata
 */
export function panelDescription(label: PageLabel): string {
  return label.panelDescription ?? label.description;
}
