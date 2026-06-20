# Function: ingestDocumentFile()

> **ingestDocumentFile**(`input`): `Promise`\<\{ `byteSize`: `number` \| `null`; `createdAt`: `Date`; `deletedAt`: `Date` \| `null`; `fileExpiresAt`: `Date`; `fileName`: `string`; `id`: `string`; `recordExpiresAt`: `Date`; `s3Key`: `string` \| `null`; `sha256`: `string`; \}\>

Defined in: src/lib/documents/ingestDocumentFile.ts:39

Stores or reuses a DocumentFile keyed by content hash.

When a non-scrubbed file with the same sha256 exists, skips virus scan and S3 upload.

## Parameters

### input

[`IngestDocumentFileInput`](../type-aliases/IngestDocumentFileInput.md)

## Returns

`Promise`\<\{ `byteSize`: `number` \| `null`; `createdAt`: `Date`; `deletedAt`: `Date` \| `null`; `fileExpiresAt`: `Date`; `fileName`: `string`; `id`: `string`; `recordExpiresAt`: `Date`; `s3Key`: `string` \| `null`; `sha256`: `string`; \}\>
