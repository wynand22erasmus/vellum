# Function: verifyPendingVerificationToken()

> **verifyPendingVerificationToken**(`token`): `Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>

Defined in: [src/lib/auth/emailVerification.ts:128](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/emailVerification.ts#L128)

Reads a pending-verification token from the login handoff page.

## Parameters

### token

`string`

`pending` query parameter

## Returns

`Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>
