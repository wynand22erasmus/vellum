# Type Alias: OrphanedResource

> **OrphanedResource** = \{ `kind`: `"s3Object"`; `s3Key`: `string`; \} \| \{ `fileId`: `string`; `kind`: `"file"`; \} \| \{ `documentId`: `string`; `kind`: `"document"`; \} \| \{ `communicationId`: `string`; `kind`: `"communication"`; \}

Defined in: [src/lib/compensation/orphan.ts:10](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/compensation/orphan.ts#L10)

A resource left inconsistent after a failed compensation attempt.
