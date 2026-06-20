# Function: linkProcessErrorByCorrelationId()

> **linkProcessErrorByCorrelationId**(`processErrorId`, `correlationId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:59](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/link-audit-process-error.ts#L59)

Resolves an `AuditLog` by metadata.correlationId and links it to a new `ProcessError`.

## Parameters

### processErrorId

`string`

### correlationId

`string`

## Returns

`Promise`\<`void`\>
