# Function: appErrorFromJwtVerify()

> **appErrorFromJwtVerify**(`err`, `context`): [`AppError`](../../app-error/classes/AppError.md)

Defined in: [src/lib/errors/jwt-errors.ts:16](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/jwt-errors.ts#L16)

Converts jose verification errors into operational `AppError` instances.

## Parameters

### err

`unknown`

Error from `jwtVerify`

### context

`"email-verification"` \| `"pending-verification"`

Which auth token flow failed

## Returns

[`AppError`](../../app-error/classes/AppError.md)
