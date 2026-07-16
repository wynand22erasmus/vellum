# Function: upsertWorkOSUser()

> **upsertWorkOSUser**(`workosUser`): `Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>

Defined in: [src/lib/users/userService.ts:45](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/users/userService.ts#L45)

Creates or updates a user from a WorkOS AuthKit profile.

## Parameters

### workosUser

`User`

User returned by `authenticateWithCode`

## Returns

`Promise`\<[`AuthUser`](../../../auth/types/interfaces/AuthUser.md)\>

Persisted user as [AuthUser](../../../auth/types/interfaces/AuthUser.md)
