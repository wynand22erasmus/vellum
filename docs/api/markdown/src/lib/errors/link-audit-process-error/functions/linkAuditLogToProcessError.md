# Function: linkAuditLogToProcessError()

> **linkAuditLogToProcessError**(`auditLogId`, `processErrorId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:12](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/link-audit-process-error.ts#L12)

Sets bidirectional `AuditLog` ↔ `ProcessError` links after both rows exist.

## Parameters

### auditLogId

`string`

### processErrorId

`string`

## Returns

`Promise`\<`void`\>
