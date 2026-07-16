# Function: createEmailVerificationToken()

> **createEmailVerificationToken**(`userId`, `email`): `Promise`\<`string`\>

Defined in: [src/lib/auth/emailVerification.ts:64](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/emailVerification.ts#L64)

Signs a link token for dev email verification (`GET /api/auth/verify-email`).

## Parameters

### userId

`string`

Local user id (`dev:{email}` or WorkOS id)

### email

`string`

Normalized recipient address

## Returns

`Promise`\<`string`\>
