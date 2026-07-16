# Function: assertEmailVerified()

> **assertEmailVerified**(`user`): `void`

Defined in: [src/lib/auth/emailVerification.ts:52](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/emailVerification.ts#L52)

Ensures the user has verified their email, is an admin, or verification is skipped in dev/E2E.

## Parameters

### user

[`AuthUser`](../../types/interfaces/AuthUser.md)

## Returns

`void`

## Throws

`AppError` With `forbidden` and `reason: EMAIL_NOT_VERIFIED` when verification is required
