# Function: verifyEmailVerificationToken()

> **verifyEmailVerificationToken**(`token`): `Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>

Defined in: [src/lib/auth/emailVerification.ts:81](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/emailVerification.ts#L81)

Validates a dev verification link and returns the user id and email.

## Parameters

### token

`string`

Query parameter from the verification email

## Returns

`Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>
