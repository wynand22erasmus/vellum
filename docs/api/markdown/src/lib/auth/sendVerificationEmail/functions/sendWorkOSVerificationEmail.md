# Function: sendWorkOSVerificationEmail()

> **sendWorkOSVerificationEmail**(`userId`): `Promise`\<`void`\>

Defined in: [src/lib/auth/sendVerificationEmail.ts:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/sendVerificationEmail.ts#L17)

Asks WorkOS to email a verification code/link to the user.

## Parameters

### userId

`string`

WorkOS user id stored in `users.id`

## Returns

`Promise`\<`void`\>
