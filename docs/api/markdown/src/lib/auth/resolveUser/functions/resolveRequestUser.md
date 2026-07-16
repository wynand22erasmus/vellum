# Function: resolveRequestUser()

> **resolveRequestUser**(`req`): `Promise`\<[`AuthUser`](../../types/interfaces/AuthUser.md) \| `null`\>

Defined in: [src/lib/auth/resolveUser.ts:41](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/resolveUser.ts#L41)

Resolves the authenticated user for an Express request (session or dev header).

## Parameters

### req

`Request`

Incoming Express request

## Returns

`Promise`\<[`AuthUser`](../../types/interfaces/AuthUser.md) \| `null`\>

Dashboard user, or `null` when unauthenticated or unverified
