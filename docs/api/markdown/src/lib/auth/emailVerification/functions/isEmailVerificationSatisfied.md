# Function: isEmailVerificationSatisfied()

> **isEmailVerificationSatisfied**(`user`): `boolean`

Defined in: [src/lib/auth/emailVerification.ts:37](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/emailVerification.ts#L37)

Returns whether the user may access protected dashboard routes.

## Parameters

### user

[`AuthUser`](../../types/interfaces/AuthUser.md)

User loaded from the `users` table

## Returns

`boolean`

## Remarks

Admins (`kind: ADMIN`) may sign in without verifying email.
