# Function: sendDevVerificationEmail()

> **sendDevVerificationEmail**(`userId`, `email`): `Promise`\<`void`\>

Defined in: [src/lib/auth/sendVerificationEmail.ts:28](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/sendVerificationEmail.ts#L28)

Emails a signed verification link for dev-auth users (Mailpit in local stacks).

## Parameters

### userId

`string`

`dev:{email}` user id

### email

`string`

Normalized recipient address

## Returns

`Promise`\<`void`\>
