# Function: linkAuditLogToProcessError()

> **linkAuditLogToProcessError**(`auditLogId`, `processErrorId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:12](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/link-audit-process-error.ts#L12)

Sets bidirectional `AuditLog` ↔ `ProcessError` links after both rows exist.

## Parameters

### auditLogId

`string`

### processErrorId

`string`

## Returns

`Promise`\<`void`\>
