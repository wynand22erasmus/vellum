# Function: resolveRequestUser()

> **resolveRequestUser**(`req`): `Promise`\<[`AuthUser`](../../types/interfaces/AuthUser.md) \| `null`\>

Defined in: [src/lib/auth/resolveUser.ts:41](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/resolveUser.ts#L41)

Resolves the authenticated user for an Express request (session or dev header).

## Parameters

### req

`Request`

Incoming Express request

## Returns

`Promise`\<[`AuthUser`](../../types/interfaces/AuthUser.md) \| `null`\>

Dashboard user, or `null` when unauthenticated or unverified
