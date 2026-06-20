# Function: createPendingVerificationToken()

> **createPendingVerificationToken**(`userId`, `email`): `Promise`\<`string`\>

Defined in: [src/lib/auth/emailVerification.ts:111](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/emailVerification.ts#L111)

Signs a short-lived token for the “verify your email” UI (resend / instructions).

## Parameters

### userId

`string`

WorkOS or dev user id

### email

`string`

Normalized email address

## Returns

`Promise`\<`string`\>
