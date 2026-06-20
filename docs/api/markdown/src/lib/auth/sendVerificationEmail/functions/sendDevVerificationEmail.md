# Function: sendDevVerificationEmail()

> **sendDevVerificationEmail**(`userId`, `email`): `Promise`\<`void`\>

Defined in: [src/lib/auth/sendVerificationEmail.ts:28](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/sendVerificationEmail.ts#L28)

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
