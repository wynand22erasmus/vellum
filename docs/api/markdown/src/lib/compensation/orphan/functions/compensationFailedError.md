# Function: compensationFailedError()

> **compensationFailedError**(`cause`, `orphans`, `detail?`): [`AppError`](../../../errors/app-error/classes/AppError.md)

Defined in: [src/lib/compensation/orphan.ts:42](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/compensation/orphan.ts#L42)

Wraps a cause error with partial-failure semantics and orphan metadata.

## Parameters

### cause

`unknown`

Original failure

### orphans

[`OrphanedResource`](../type-aliases/OrphanedResource.md)[]

Resources that remain inconsistent

### detail?

`string` = `'The operation failed and automatic cleanup could not complete. Support has been notified.'`

User-safe message

## Returns

[`AppError`](../../../errors/app-error/classes/AppError.md)
