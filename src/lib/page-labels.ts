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
    nav: 'Documents',
    description: 'Delivery envelopes pairing a file with a recipient (password, download limits).',
    href: '/admin/documents',
  },
  adminFiles: {
    nav: 'Files',
    description: 'Shared file assets in object storage (deduplicated by SHA-256).',
    href: '/admin/files',
  },
  adminRecipients: {
    nav: 'Recipients',
    description: 'Recipient identities with delivery contact and OTP channel preferences.',
    href: '/admin/recipients',
  },
  adminCommunications: {
    nav: 'Communications',
    description: 'Outbound verify URLs with expiry and revocation state per envelope.',
    href: '/admin/communications',
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
  adminDeadLetters: {
    nav: 'Dead letters',
    description: 'Failed queue payloads from audit, process-error, and webhook pipelines.',
    href: '/admin/dead-letters',
  },
  adminProcessErrors: {
    nav: 'Process errors',
    description: 'RFC 9457 operational failures from HTTP, workers, and queues.',
    href: '/admin/process-errors',
  },
  adminWebhookDeliveries: {
    nav: 'Webhook deliveries',
    description: 'Outbound audit webhook HTTP attempts.',
    href: '/admin/webhook-deliveries',
  },
  adminFileDetail: {
    nav: 'File detail',
    description: 'Shared file metadata and linked document envelopes.',
  },
  adminDocumentDetail: {
    nav: 'Document detail',
    description: 'Envelope metadata, outbound links, and audit trail.',
  },
  adminCommunicationDetail: {
    nav: 'Communication detail',
    description: 'Verify URL metadata and related audit events.',
  },
  adminRecipientDetail: {
    nav: 'Recipient detail',
    description: 'Recipient identity and linked document envelopes.',
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
    id: 'admin-files',
    href: PAGE_LABELS.adminFiles.href!,
    label: PAGE_LABELS.adminFiles.nav,
    description: PAGE_LABELS.adminFiles.description,
  },
  {
    id: 'admin-documents',
    href: PAGE_LABELS.adminDocuments.href!,
    label: PAGE_LABELS.adminDocuments.nav,
    description: PAGE_LABELS.adminDocuments.description,
  },
  {
    id: 'admin-recipients',
    href: PAGE_LABELS.adminRecipients.href!,
    label: PAGE_LABELS.adminRecipients.nav,
    description: PAGE_LABELS.adminRecipients.description,
  },
  {
    id: 'admin-communications',
    href: PAGE_LABELS.adminCommunications.href!,
    label: PAGE_LABELS.adminCommunications.nav,
    description: PAGE_LABELS.adminCommunications.description,
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
    id: 'admin-dead-letters',
    href: PAGE_LABELS.adminDeadLetters.href!,
    label: PAGE_LABELS.adminDeadLetters.nav,
    description: PAGE_LABELS.adminDeadLetters.description,
  },
  {
    id: 'admin-process-errors',
    href: PAGE_LABELS.adminProcessErrors.href!,
    label: PAGE_LABELS.adminProcessErrors.nav,
    description: PAGE_LABELS.adminProcessErrors.description,
  },
  {
    id: 'admin-webhook-deliveries',
    href: PAGE_LABELS.adminWebhookDeliveries.href!,
    label: PAGE_LABELS.adminWebhookDeliveries.nav,
    description: PAGE_LABELS.adminWebhookDeliveries.description,
  },
] as const;

const PAGE_LABEL_BY_PATH: Record<string, PageLabel> = {
  '/dashboard': PAGE_LABELS.dashboard,
  '/admin': PAGE_LABELS.admin,
  '/dev': PAGE_LABELS.development,
  '/admin/documents': PAGE_LABELS.adminDocuments,
  '/admin/files': PAGE_LABELS.adminFiles,
  '/admin/recipients': PAGE_LABELS.adminRecipients,
  '/admin/communications': PAGE_LABELS.adminCommunications,
  '/admin/users': PAGE_LABELS.adminUsers,
  '/admin/audit-logs': PAGE_LABELS.adminAuditLogs,
  '/admin/dead-letters': PAGE_LABELS.adminDeadLetters,
  '/admin/failed-audit-logs': PAGE_LABELS.adminDeadLetters,
  '/admin/process-errors': PAGE_LABELS.adminProcessErrors,
  '/admin/failed-process-errors': PAGE_LABELS.adminDeadLetters,
  '/admin/webhook-deliveries': PAGE_LABELS.adminWebhookDeliveries,
  '/admin/failed-webhook-deliveries': PAGE_LABELS.adminDeadLetters,
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
