# Function: sendWorkOSVerificationEmail()

> **sendWorkOSVerificationEmail**(`userId`): `Promise`\<`void`\>

Defined in: [src/lib/auth/sendVerificationEmail.ts:17](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/sendVerificationEmail.ts#L17)

Asks WorkOS to email a verification code/link to the user.

## Parameters

### userId

`string`

WorkOS user id stored in `users.id`

## Returns

`Promise`\<`void`\>
