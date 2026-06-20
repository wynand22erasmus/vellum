# SFTP ingestion

Kiteworks-style MFT drop: partners upload a data file and a JSON manifest via SFTP; the worker runs the same lifecycle as `POST /api/upload`.

## Compose stack

The `sftp` service (`atmoz/sftp:alpine`) exposes port **2222** by default. The `worker` service shares the `sftp_data` volume and watches the upload root.

| Item | Value (development) |
|------|---------------------|
| Host | `localhost` |
| Port | `2222` (`SFTP_PORT`) |
| User | `partner` (`SFTP_USER`) |
| Password | `devpassword` (`SFTP_PASSWORD`) |
| Upload directory | `/` (chrooted home — volume root) |

Connect:

```bash
sftp -P 2222 partner@localhost
```

## Drop format

For each file, place a sidecar manifest beside it using `{filename}{SFTP_MANIFEST_SUFFIX}` (default `.json`):

| File | Purpose |
|------|---------|
| `report.pdf` | Document bytes |
| `report.pdf.json` | Recipient metadata |

Manifest JSON (same fields as single upload):

```json
{
  "recipientEmail": "recipient@example.com",
  "password": "download-secret",
  "linkTtl": 86400,
  "fileTtl": 604800
}
```

`linkTtl` and `fileTtl` are seconds. `linkTtl` must not exceed `fileTtl`.

## Pipeline and audit events

The worker polls the inbox every `SFTP_POLL_INTERVAL_MS` (default 5s) and waits until file sizes are stable for `SFTP_STABLE_FILE_MS` before processing.

| Step | Audit event |
|------|-------------|
| File detected | `SFTP_FILE_RECEIVED` |
| Manifest valid | `SFTP_METADATA_VALIDATED` |
| ClamAV clean | `SFTP_VIRUS_SCAN_PASSED` |
| Object stored | `SFTP_STORAGE_UPLOADED` |
| Link row created | `SFTP_DOCUMENT_CREATED` |
| Email job enqueued | `SFTP_EMAIL_QUEUED` |
| Source archived | `SFTP_INGESTION_COMPLETED` |
| Any failure | `SFTP_INGESTION_FAILED` (`metadata.step`, `metadata.reason`) |

Successful drops move to `SFTP_ARCHIVE_PATH`; failures move to `SFTP_FAILED_PATH` with a `{file}.error.json` sidecar.

The email worker still emits `EMAIL_INITIAL_SENT` when Mailpit/SES delivers the link.

## Configuration

See [CONFIG.md](./CONFIG.md) for all `SFTP_*` environment variables.

## Local test (Compose)

```bash
# After stack is up, from the host:
echo '{"recipientEmail":"test@example.com","password":"secret123","linkTtl":86400,"fileTtl":604800}' > /tmp/report.pdf.json
echo 'hello sftp' > /tmp/report.pdf

docker compose cp /tmp/report.pdf worker:/sftp/report.pdf
docker compose cp /tmp/report.pdf.json worker:/sftp/report.pdf.json
```

Check Mailpit for the initial link email and filter admin audit logs for `SFTP_*` events.
