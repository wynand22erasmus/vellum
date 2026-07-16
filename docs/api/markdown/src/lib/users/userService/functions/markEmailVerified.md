# Function: markEmailVerified()

> **markEmailVerified**(`userId`): `Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>

Defined in: [src/lib/users/userService.ts:116](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/users/userService.ts#L116)

Marks a user's email as verified after they follow the dev verification link.

## Parameters

### userId

`string`

Primary key in `User`

## Returns

`Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>
