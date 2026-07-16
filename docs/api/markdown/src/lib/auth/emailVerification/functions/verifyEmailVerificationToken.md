# Function: verifyEmailVerificationToken()

> **verifyEmailVerificationToken**(`token`): `Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>

Defined in: [src/lib/auth/emailVerification.ts:81](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/emailVerification.ts#L81)

Validates a dev verification link and returns the user id and email.

## Parameters

### token

`string`

Query parameter from the verification email

## Returns

`Promise`\<\{ `email`: `string`; `userId`: `string`; \}\>
