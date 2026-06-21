# Function: integratorOrAdminAuth()

> **integratorOrAdminAuth**(`req`, `res`, `next`): `Promise`\<`void`\>

Defined in: [src/server/middleware/integratorOrAdminAuth.ts:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/middleware/integratorOrAdminAuth.ts#L22)

Accepts `Authorization: Bearer <API_KEY>` or an admin session cookie.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`void`\>
