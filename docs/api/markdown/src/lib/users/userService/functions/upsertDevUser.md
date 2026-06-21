# Function: upsertDevUser()

> **upsertDevUser**(`email`): `Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>

Defined in: [src/lib/users/userService.ts:85](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/users/userService.ts#L85)

Creates or updates a dev-auth user (`dev:{email}` id).

## Parameters

### email

`string`

Recipient email from `X-Dev-User-Email`

## Returns

`Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>

## Remarks

New users start with `emailVerified: false` until they use
`createEmailVerificationToken` (dev Mailpit flow). When
`SKIP_EMAIL_VERIFICATION` is enabled, new users are created as verified.
