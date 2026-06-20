# src/lib/uploadFilename

Upload filename sanitization and allowed-extension checks.

## Remarks

Strips trailing “decoy” executable extensions (e.g. `report.pdf.exe` → `report.pdf`)
before validating the effective extension against [DEFAULT\_ALLOWED\_UPLOAD\_EXTENSIONS](variables/DEFAULT_ALLOWED_UPLOAD_EXTENSIONS.md)
or `ALLOWED_UPLOAD_EXTENSIONS`. Use `["*"]` in env to disable the allowlist only.

## Variables

- [DEFAULT\_ALLOWED\_UPLOAD\_EXTENSIONS](variables/DEFAULT_ALLOWED_UPLOAD_EXTENSIONS.md)

## Functions

- [effectiveExtensionFromBasename](functions/effectiveExtensionFromBasename.md)
- [parseAllowedUploadExtensionsFromEnv](functions/parseAllowedUploadExtensionsFromEnv.md)
- [resolveUploadFileName](functions/resolveUploadFileName.md)
- [stripDangerousTrailingExtensions](functions/stripDangerousTrailingExtensions.md)
