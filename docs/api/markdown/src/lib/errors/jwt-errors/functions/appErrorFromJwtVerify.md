# Function: appErrorFromJwtVerify()

> **appErrorFromJwtVerify**(`err`, `context`): [`AppError`](../../app-error/classes/AppError.md)

Defined in: [src/lib/errors/jwt-errors.ts:16](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/jwt-errors.ts#L16)

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
