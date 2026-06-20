# Function: createEmailVerificationToken()

> **createEmailVerificationToken**(`userId`, `email`): `Promise`\<`string`\>

Defined in: [src/lib/auth/emailVerification.ts:64](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/emailVerification.ts#L64)

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
