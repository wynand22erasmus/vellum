# Function: assertEmailVerified()

> **assertEmailVerified**(`user`): `void`

Defined in: [src/lib/auth/emailVerification.ts:52](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/emailVerification.ts#L52)

Ensures the user has verified their email, is an admin, or verification is skipped in dev/E2E.

## Parameters

### user

[`AuthUser`](../../types/interfaces/AuthUser.md)

## Returns

`void`

## Throws

`AppError` With `forbidden` and `reason: EMAIL_NOT_VERIFIED` when verification is required
