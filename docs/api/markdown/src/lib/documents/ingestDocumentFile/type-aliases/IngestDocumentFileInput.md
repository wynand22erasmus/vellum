# Type Alias: IngestDocumentFileInput

> **IngestDocumentFileInput** = `object`

Defined in: src/lib/documents/ingestDocumentFile.ts:24

## Properties

### buffer

> **buffer**: `Buffer`

Defined in: src/lib/documents/ingestDocumentFile.ts:25

***

### fileName

> **fileName**: `string`

Defined in: src/lib/documents/ingestDocumentFile.ts:26

***

### fileTtlSeconds

> **fileTtlSeconds**: `number`

Defined in: src/lib/documents/ingestDocumentFile.ts:28

***

### mimeType

> **mimeType**: `string`

Defined in: src/lib/documents/ingestDocumentFile.ts:27

***

### skipVirusScan?

> `optional` **skipVirusScan?**: `boolean`

Defined in: src/lib/documents/ingestDocumentFile.ts:31

When true, skip ClamAV (caller already scanned, e.g. SFTP pipeline).

***

### stack

> **stack**: [`CompensationStack`](../../../compensation/compensation-stack/classes/CompensationStack.md)

Defined in: src/lib/documents/ingestDocumentFile.ts:29
