# Function: markEmailVerified()

> **markEmailVerified**(`userId`): `Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>

Defined in: [src/lib/users/userService.ts:116](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/users/userService.ts#L116)

Marks a user's email as verified after they follow the dev verification link.

## Parameters

### userId

`string`

Primary key in `users`

## Returns

`Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>
