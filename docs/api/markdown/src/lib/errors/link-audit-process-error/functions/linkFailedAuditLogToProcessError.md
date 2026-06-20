# Function: linkFailedAuditLogToProcessError()

> **linkFailedAuditLogToProcessError**(`failedAuditLogId`, `processErrorId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:29](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/link-audit-process-error.ts#L29)

Sets `FailedAuditLog.processErrorId` after the process error row is persisted.

## Parameters

### failedAuditLogId

`string`

### processErrorId

`string`

## Returns

`Promise`\<`void`\>
