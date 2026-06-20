# Variable: PAGE\_LABELS

> `const` **PAGE\_LABELS**: `object`

Defined in: [src/lib/page-labels.ts:19](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/page-labels.ts#L19)

Canonical labels and descriptions for known dashboard and auth routes.

## Type Declaration

### admin

> `readonly` **admin**: `object`

#### admin.description

> `readonly` **description**: `"Read-only views of Postgres data. Secrets (download tokens, password hashes, object keys) are never shown."` = `'Read-only views of Postgres data. Secrets (download tokens, password hashes, object keys) are never shown.'`

#### admin.href

> `readonly` **href**: `"/admin"` = `'/admin'`

#### admin.nav

> `readonly` **nav**: `"Admin"` = `'Admin'`

### adminAuditLogs

> `readonly` **adminAuditLogs**: `object`

#### adminAuditLogs.description

> `readonly` **description**: `"Compliance events with optional filters."` = `'Compliance events with optional filters.'`

#### adminAuditLogs.href

> `readonly` **href**: `"/admin/audit-logs"` = `'/admin/audit-logs'`

#### adminAuditLogs.nav

> `readonly` **nav**: `"Audit logs"` = `'Audit logs'`

### adminDocumentDetail

> `readonly` **adminDocumentDetail**: `object`

#### adminDocumentDetail.description

> `readonly` **description**: `"Document metadata and audit trail for this upload."` = `'Document metadata and audit trail for this upload.'`

#### adminDocumentDetail.nav

> `readonly` **nav**: `"Document detail"` = `'Document detail'`

### adminDocumentFileDetail

> `readonly` **adminDocumentFileDetail**: `object`

#### adminDocumentFileDetail.description

> `readonly` **description**: `"Shared file metadata and linked recipient rows."` = `'Shared file metadata and linked recipient rows.'`

#### adminDocumentFileDetail.nav

> `readonly` **nav**: `"Document file detail"` = `'Document file detail'`

### adminDocumentFiles

> `readonly` **adminDocumentFiles**: `object`

#### adminDocumentFiles.description

> `readonly` **description**: `"Shared file assets in object storage (deduplicated by SHA-256)."` = `'Shared file assets in object storage (deduplicated by SHA-256).'`

#### adminDocumentFiles.href

> `readonly` **href**: `"/admin/document-files"` = `'/admin/document-files'`

#### adminDocumentFiles.nav

> `readonly` **nav**: `"Document files"` = `'Document files'`

### adminDocuments

> `readonly` **adminDocuments**: `object`

#### adminDocuments.description

> `readonly` **description**: `"Per-recipient download links, passwords, and lifecycle state."` = `'Per-recipient download links, passwords, and lifecycle state.'`

#### adminDocuments.href

> `readonly` **href**: `"/admin/documents"` = `'/admin/documents'`

#### adminDocuments.nav

> `readonly` **nav**: `"Document links"` = `'Document links'`

### adminFailedAuditLogs

> `readonly` **adminFailedAuditLogs**: `object`

#### adminFailedAuditLogs.description

> `readonly` **description**: `"Dead-letter payloads when audit enqueue fails."` = `'Dead-letter payloads when audit enqueue fails.'`

#### adminFailedAuditLogs.href

> `readonly` **href**: `"/admin/failed-audit-logs"` = `'/admin/failed-audit-logs'`

#### adminFailedAuditLogs.nav

> `readonly` **nav**: `"Failed audit logs"` = `'Failed audit logs'`

### adminFailedProcessErrors

> `readonly` **adminFailedProcessErrors**: `object`

#### adminFailedProcessErrors.description

> `readonly` **description**: `"Dead-letter payloads when process-error enqueue fails."` = `'Dead-letter payloads when process-error enqueue fails.'`

#### adminFailedProcessErrors.href

> `readonly` **href**: `"/admin/failed-process-errors"` = `'/admin/failed-process-errors'`

#### adminFailedProcessErrors.nav

> `readonly` **nav**: `"Failed process errors"` = `'Failed process errors'`

### adminFailedWebhookDeliveries

> `readonly` **adminFailedWebhookDeliveries**: `object`

#### adminFailedWebhookDeliveries.description

> `readonly` **description**: `"Dead-letter payloads when webhook delivery exhausts retries."` = `'Dead-letter payloads when webhook delivery exhausts retries.'`

#### adminFailedWebhookDeliveries.href

> `readonly` **href**: `"/admin/failed-webhook-deliveries"` = `'/admin/failed-webhook-deliveries'`

#### adminFailedWebhookDeliveries.nav

> `readonly` **nav**: `"Failed webhook deliveries"` = `'Failed webhook deliveries'`

### adminProcessErrors

> `readonly` **adminProcessErrors**: `object`

#### adminProcessErrors.description

> `readonly` **description**: `"RFC 9457 operational failures from HTTP, workers, and queues."` = `'RFC 9457 operational failures from HTTP, workers, and queues.'`

#### adminProcessErrors.href

> `readonly` **href**: `"/admin/process-errors"` = `'/admin/process-errors'`

#### adminProcessErrors.nav

> `readonly` **nav**: `"Process errors"` = `'Process errors'`

### adminUsers

> `readonly` **adminUsers**: `object`

#### adminUsers.description

> `readonly` **description**: `"Dashboard accounts and roles."` = `'Dashboard accounts and roles.'`

#### adminUsers.href

> `readonly` **href**: `"/admin/users"` = `'/admin/users'`

#### adminUsers.nav

> `readonly` **nav**: `"Users"` = `'Users'`

### adminWebhookDeliveries

> `readonly` **adminWebhookDeliveries**: `object`

#### adminWebhookDeliveries.description

> `readonly` **description**: `"Outbound audit webhook HTTP attempts."` = `'Outbound audit webhook HTTP attempts.'`

#### adminWebhookDeliveries.href

> `readonly` **href**: `"/admin/webhook-deliveries"` = `'/admin/webhook-deliveries'`

#### adminWebhookDeliveries.nav

> `readonly` **nav**: `"Webhook deliveries"` = `'Webhook deliveries'`

### dashboard

> `readonly` **dashboard**: `object`

#### dashboard.description

> `readonly` **description**: `"Documents addressed to you. Request a new access link — downloads always require the email link and file password."` = `'Documents addressed to you. Request a new access link — downloads always require the email link and file password.'`

#### dashboard.href

> `readonly` **href**: `"/dashboard"` = `'/dashboard'`

#### dashboard.nav

> `readonly` **nav**: `"Dashboard"` = `'Dashboard'`

#### dashboard.trail

> `readonly` **trail**: `"Home"` = `'Home'`

### development

> `readonly` **development**: `object`

#### development.description

> `readonly` **description**: `"Local infrastructure and tooling for debugging and development."` = `'Local infrastructure and tooling for debugging and development.'`

#### development.href

> `readonly` **href**: `"/dev"` = `'/dev'`

#### development.nav

> `readonly` **nav**: `"Development"` = `'Development'`

### devLogin

> `readonly` **devLogin**: `object`

#### devLogin.description

> `readonly` **description**: `"Development sign-in with email verification."` = `'Development sign-in with email verification.'`

#### devLogin.nav

> `readonly` **nav**: `"Dev login"` = `'Dev login'`

#### devLogin.panelDescription

> `readonly` **panelDescription**: `"Enter your email to access the dashboard. You must verify your address before signing in."` = `'Enter your email to access the dashboard. You must verify your address before signing in.'`

### devWebhooks

> `readonly` **devWebhooks**: `object`

#### devWebhooks.description

> `readonly` **description**: `"Outbound audit webhook delivery attempts (dev only)."` = `'Outbound audit webhook delivery attempts (dev only).'`

#### devWebhooks.href

> `readonly` **href**: `"/dev/webhooks"` = `'/dev/webhooks'`

#### devWebhooks.nav

> `readonly` **nav**: `"Webhook inspector"` = `'Webhook inspector'`

### emailVerification

> `readonly` **emailVerification**: `object`

#### emailVerification.description

> `readonly` **description**: `"Check your inbox for a verification link."` = `'Check your inbox for a verification link.'`

#### emailVerification.nav

> `readonly` **nav**: `"Email verification"` = `'Email verification'`

### secureDocumentDownload

> `readonly` **secureDocumentDownload**: `object`

#### secureDocumentDownload.description

> `readonly` **description**: `"Enter the file password from your email."` = `'Enter the file password from your email.'`

#### secureDocumentDownload.nav

> `readonly` **nav**: `"Secure document download"` = `'Secure document download'`

#### secureDocumentDownload.panelDescription

> `readonly` **panelDescription**: `"Enter the file password you received separately. If your download does not start, log in to your Vellum dashboard to request a new link."` = `'Enter the file password you received separately. If your download does not start, log in to your Vellum dashboard to request a new link.'`

### secureDownload

> `readonly` **secureDownload**: `object`

#### secureDownload.description

> `readonly` **description**: `"Enter the file password to download your document."` = `'Enter the file password to download your document.'`

#### secureDownload.nav

> `readonly` **nav**: `"Secure download"` = `'Secure download'`

### secureDownloadComplete

> `readonly` **secureDownloadComplete**: `object`

#### secureDownloadComplete.description

> `readonly` **description**: `"Your document download has finished."` = `'Your document download has finished.'`

#### secureDownloadComplete.nav

> `readonly` **nav**: `"Download complete"` = `'Download complete'`

#### secureDownloadComplete.panelDescription

> `readonly` **panelDescription**: `"Your file download started successfully. You can close this browser tab when you are done."` = `'Your file download started successfully. You can close this browser tab when you are done.'`

### signIn

> `readonly` **signIn**: `object`

#### signIn.description

> `readonly` **description**: `"Sign in to access your documents."` = `'Sign in to access your documents.'`

#### signIn.nav

> `readonly` **nav**: `"Sign in"` = `'Sign in'`

### verifyEmail

> `readonly` **verifyEmail**: `object`

#### verifyEmail.description

> `readonly` **description**: `"Complete email verification to continue."` = `'Complete email verification to continue.'`

#### verifyEmail.nav

> `readonly` **nav**: `"Verify your email"` = `'Verify your email'`

#### verifyEmail.panelDescription

> `readonly` **panelDescription**: `"We sent a verification message to your inbox. Confirm your email address, then return here to sign in."` = `'We sent a verification message to your inbox. Confirm your email address, then return here to sign in.'`
