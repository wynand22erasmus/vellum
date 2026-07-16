# Function: linkAuditLogByCorrelationId()

> **linkAuditLogByCorrelationId**(`auditLogId`, `correlationId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:45](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/link-audit-process-error.ts#L45)

Resolves a `ProcessError` by correlationId and links it to a new `AuditLog`.

## Parameters

### auditLogId

`string`

### correlationId

`string`

## Returns

`Promise`\<`void`\>
