# Function: findUserById()

> **findUserById**(`id`): `Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md) \| `null`\>

Defined in: [src/lib/users/userService.ts:129](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/users/userService.ts#L129)

Loads a user by id for session validation.

## Parameters

### id

`string`

Session subject (`sub` claim)

## Returns

`Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md) \| `null`\>
