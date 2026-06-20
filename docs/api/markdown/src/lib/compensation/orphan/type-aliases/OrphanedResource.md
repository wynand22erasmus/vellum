# Type Alias: OrphanedResource

> **OrphanedResource** = \{ `kind`: `"s3Object"`; `s3Key`: `string`; \} \| \{ `id`: `string`; `kind`: `"document"`; \} \| \{ `id`: `string`; `kind`: `"documentFile"`; \} \| \{ `documentId`: `string`; `kind`: `"presignedUrl"`; \}

Defined in: [src/lib/compensation/orphan.ts:10](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/compensation/orphan.ts#L10)

A resource left inconsistent after a failed compensation attempt.
