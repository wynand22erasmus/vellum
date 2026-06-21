# Function: isEmailVerificationSatisfied()

> **isEmailVerificationSatisfied**(`user`): `boolean`

Defined in: [src/lib/auth/emailVerification.ts:37](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/emailVerification.ts#L37)

Returns whether the user may access protected dashboard routes.

## Parameters

### user

[`AuthUser`](../../types/interfaces/AuthUser.md)

User loaded from the `users` table

## Returns

`boolean`

## Remarks

Admins (`kind: ADMIN`) may sign in without verifying email.
