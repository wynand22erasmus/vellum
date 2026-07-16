# Variable: PAGE\_LABELS

> `const` **PAGE\_LABELS**: `object`

Defined in: [src/lib/page-labels.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/page-labels.ts#L19)

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

### adminCommunicationDetail

> `readonly` **adminCommunicationDetail**: `object`

#### adminCommunicationDetail.description

> `readonly` **description**: `"Verify URL metadata and related audit events."` = `'Verify URL metadata and related audit events.'`

#### adminCommunicationDetail.nav

> `readonly` **nav**: `"Communication detail"` = `'Communication detail'`

### adminCommunications

> `readonly` **adminCommunications**: `object`

#### adminCommunications.description

> `readonly` **description**: `"Outbound verify URLs with expiry and revocation state per envelope."` = `'Outbound verify URLs with expiry and revocation state per envelope.'`

#### adminCommunications.href

> `readonly` **href**: `"/admin/communications"` = `'/admin/communications'`

#### adminCommunications.nav

> `readonly` **nav**: `"Communications"` = `'Communications'`

### adminDeadLetters

> `readonly` **adminDeadLetters**: `object`

#### adminDeadLetters.description

> `readonly` **description**: `"Failed queue payloads from audit, process-error, and webhook pipelines."` = `'Failed queue payloads from audit, process-error, and webhook pipelines.'`

#### adminDeadLetters.href

> `readonly` **href**: `"/admin/dead-letters"` = `'/admin/dead-letters'`

#### adminDeadLetters.nav

> `readonly` **nav**: `"Dead letters"` = `'Dead letters'`

### adminDocumentDetail

> `readonly` **adminDocumentDetail**: `object`

#### adminDocumentDetail.description

> `readonly` **description**: `"Envelope metadata, outbound links, and audit trail."` = `'Envelope metadata, outbound links, and audit trail.'`

#### adminDocumentDetail.nav

> `readonly` **nav**: `"Document detail"` = `'Document detail'`

### adminDocuments

> `readonly` **adminDocuments**: `object`

#### adminDocuments.description

> `readonly` **description**: `"Delivery envelopes pairing a file with a recipient (password, download limits)."` = `'Delivery envelopes pairing a file with a recipient (password, download limits).'`

#### adminDocuments.href

> `readonly` **href**: `"/admin/documents"` = `'/admin/documents'`

#### adminDocuments.nav

> `readonly` **nav**: `"Documents"` = `'Documents'`

### adminFileDetail

> `readonly` **adminFileDetail**: `object`

#### adminFileDetail.description

> `readonly` **description**: `"Shared file metadata and linked document envelopes."` = `'Shared file metadata and linked document envelopes.'`

#### adminFileDetail.nav

> `readonly` **nav**: `"File detail"` = `'File detail'`

### adminFiles

> `readonly` **adminFiles**: `object`

#### adminFiles.description

> `readonly` **description**: `"Shared file assets in object storage (deduplicated by SHA-256)."` = `'Shared file assets in object storage (deduplicated by SHA-256).'`

#### adminFiles.href

> `readonly` **href**: `"/admin/files"` = `'/admin/files'`

#### adminFiles.nav

> `readonly` **nav**: `"Files"` = `'Files'`

### adminProcessErrors

> `readonly` **adminProcessErrors**: `object`

#### adminProcessErrors.description

> `readonly` **description**: `"RFC 9457 operational failures from HTTP, workers, and queues."` = `'RFC 9457 operational failures from HTTP, workers, and queues.'`

#### adminProcessErrors.href

> `readonly` **href**: `"/admin/process-errors"` = `'/admin/process-errors'`

#### adminProcessErrors.nav

> `readonly` **nav**: `"Process errors"` = `'Process errors'`

### adminRecipientDetail

> `readonly` **adminRecipientDetail**: `object`

#### adminRecipientDetail.description

> `readonly` **description**: `"Recipient identity and linked document envelopes."` = `'Recipient identity and linked document envelopes.'`

#### adminRecipientDetail.nav

> `readonly` **nav**: `"Recipient detail"` = `'Recipient detail'`

### adminRecipients

> `readonly` **adminRecipients**: `object`

#### adminRecipients.description

> `readonly` **description**: `"Recipient identities with delivery contact and OTP channel preferences."` = `'Recipient identities with delivery contact and OTP channel preferences.'`

#### adminRecipients.href

> `readonly` **href**: `"/admin/recipients"` = `'/admin/recipients'`

#### adminRecipients.nav

> `readonly` **nav**: `"Recipients"` = `'Recipients'`

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
