# Function: verifyPendingVerificationToken()

> **verifyPendingVerificationToken**(`token`): `Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>

Defined in: [src/lib/auth/emailVerification.ts:128](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/emailVerification.ts#L128)

Reads a pending-verification token from the login handoff page.

## Parameters

### token

`string`

`pending` query parameter

## Returns

`Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>
