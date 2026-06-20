# Function: linkAuditLogByCorrelationId()

> **linkAuditLogByCorrelationId**(`auditLogId`, `correlationId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:42](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/link-audit-process-error.ts#L42)

Resolves a `ProcessError` by correlationId and links it to a new `AuditLog`.

## Parameters

### auditLogId

`string`

### correlationId

`string`

## Returns

`Promise`\<`void`\>
