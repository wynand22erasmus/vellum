# Function: linkProcessErrorByCorrelationId()

> **linkProcessErrorByCorrelationId**(`processErrorId`, `correlationId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:62](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/link-audit-process-error.ts#L62)

Resolves an `AuditLog` by metadata.correlationId and links it to a new `ProcessError`.

## Parameters

### processErrorId

`string`

### correlationId

`string`

## Returns

`Promise`\<`void`\>
