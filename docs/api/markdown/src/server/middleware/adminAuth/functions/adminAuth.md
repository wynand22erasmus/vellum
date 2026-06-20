# Function: adminAuth()

> **adminAuth**(`req`, `res`, `next`): `Promise`\<`void`\>

Defined in: [src/server/middleware/adminAuth.ts:16](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/middleware/adminAuth.ts#L16)

Populates `req.user` and rejects non-admin callers. Used for `/docs/` and `/api/admin/*`.
Unauthenticated HTML requests redirect to sign-in with `returnTo` preserved.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`void`\>
