# Function: ingestFile()

> **ingestFile**(`input`): `Promise`\<\{ `byteSize`: `number` \| `null`; `createdAt`: `Date`; `deletedAt`: `Date` \| `null`; `fileExpiresAt`: `Date`; `fileId`: `string`; `fileName`: `string`; `recordExpiresAt`: `Date`; `s3Key`: `string` \| `null`; `sha256`: `string`; `updatedAt`: `Date`; \}\>

Defined in: src/lib/documents/ingestFile.ts:36

Stores or reuses a DbFile keyed by content hash.

## Parameters

### input

[`IngestFileInput`](../type-aliases/IngestFileInput.md)

## Returns

`Promise`\<\{ `byteSize`: `number` \| `null`; `createdAt`: `Date`; `deletedAt`: `Date` \| `null`; `fileExpiresAt`: `Date`; `fileId`: `string`; `fileName`: `string`; `recordExpiresAt`: `Date`; `s3Key`: `string` \| `null`; `sha256`: `string`; `updatedAt`: `Date`; \}\>
