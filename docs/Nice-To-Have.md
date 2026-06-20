# Nice-To-Have Features

Deferred items from the competitive feature analysis (June 2026). These were considered valuable but **not selected** for the current implementation queue. Revisit when enterprise requirements demand them — the **11-item roadmap is complete** (see `vellum_feature_roadmap` plan).

## Distribution & integrator experience

### Uploader download notification email

- Optional email to the uploader: “Your document to {recipient} was downloaded.”
- **Peers:** SendSafely, Kiteworks.
- **Note:** Outbound webhooks per `AuditEventType` (including `FILE_DOWNLOAD_SUCCESS`) shipped in roadmap item 11; this is the uploader-facing email only.

### Chunked / resumable large-file uploads

- Tus protocol or S3 multipart presigned upload for files above the in-memory `multer` limit.
- Pause/resume from the UI for slow or unreliable connections.
- **Peers:** ITSWEBER Send, FileRise, Gokapi.
- **Note:** [`src/server/routes/upload.ts`](../src/server/routes/upload.ts) currently buffers uploads in memory.

### Inbound file request links

- “File request” flow: generate a link for an external party to upload into your bucket (claims intake, university applications).
- **Peers:** Gokapi file requests, Kiteworks dropzones.
- **Note:** New product surface; reuses storage and audit infrastructure but is inbound, not outbound.

## Integration channels

### SMTP secure gateway (Kiteworks-style)

- SMTP listener or Postfix milter: intercept outbound mail with attachments, upload via internal API, replace body with a Vellum secure link.
- Serves fax-to-email / scan-to-email without per-device integration (see design doc Appendix B.3).
- **Peers:** Kiteworks Secure SMTP Automation.

### Periodic audit export to S3

- Scheduled job exporting audit logs to S3 for long-term SIEM retention (SendSafely pattern).
- **Note:** Distinct from the selected **audit log export API** (on-demand query); this is automated archival.

## Security hardening

### Secondary malware scan (VirusTotal / quarantine)

- ClamAV first; optional VirusTotal for files under a size cap.
- `scanStatus` on `Document`: `pending` | `clean` | `infected`; quarantine until clean.
- **Peers:** FileDuck.

### QR code on verify email / dashboard

- Client-side QR for the verify URL; useful for in-branch banking scenarios.
- **Peers:** ITSWEBER Send.

### Optional client-side encryption layer

- Encrypt in browser before upload; server stores ciphertext; password unwraps key.
- **Trade-off:** Conflicts with ClamAV unless scan-after-decrypt or tenant opts out of server-side AV.
- **Peers:** SkySend, SecuShare, Gokapi (optional E2E), SendSafely.

### DLP / content inspection hooks

- Pre-upload MIME deep inspection, PII regex, block lists; webhook to external DLP.
- **Peers:** Kiteworks Data Policy Engine.

## Enterprise & compliance extras

### Expiry and undownloaded-item notifications

- Notify uploader when a link expires without a download, or when TTL is approaching.
- **Peers:** SendSafely.

### Regional data residency controls

- Per-tenant or per-upload AWS region / data-center selection.
- **Peers:** SendSafely.

### Attribute-based access control (ABAC)

- Policy engine evaluating data sensitivity, actor, and action for uploads and downloads.
- **Peers:** Kiteworks.

### View-only delivery / watermarking

- PDF watermark with recipient identity and timestamp; block download or limit to in-browser view.
- Common in legal and financial secure delivery products.

### ~~Document deduplication on upload~~

- ~~Store identical files once in S3; multiple document rows reference the same object key.~~
- **Shipped:** `DocumentFile` + SHA-256 dedup (roadmap items 7–8).

## Explicitly out of scope (do not copy)

These appeared in competitor products but conflict with Vellum’s positioning:

- **Anonymous zero-knowledge-only flows** — Vellum targets known recipients with audit, not untraceable drops.
- **General-purpose file manager** — FileRise / Nextcloud scope; keep the dashboard document-centric.
- **Replacing the two-key model** — Link-only or account-only auth defeats the regulated-industry password-out-of-band model.

## Shipped roadmap (reference)

All 11 items from the feature roadmap are complete:

1. ~~Download count limits~~
2. ~~Manual revocation API~~
3. ~~Audit log export API~~
4. ~~Soften one-time download UX~~
5. ~~Recipient OTP (email/SMS/WhatsApp/authenticator)~~
6. ~~Branded notification emails~~
7. ~~Batch / multi-recipient upload~~
8. ~~SHA-256 integrity checksum~~
9. ~~SFTP ingestion endpoint~~
10. ~~hCaptcha before password submit (verify page gate)~~
11. ~~Outbound webhooks + `/dev/webhooks` inspector~~
