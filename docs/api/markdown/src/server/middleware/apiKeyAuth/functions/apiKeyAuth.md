# Function: apiKeyAuth()

> **apiKeyAuth**(`req`, `_res`, `next`): `void`

Defined in: [src/server/middleware/apiKeyAuth.ts:16](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/middleware/apiKeyAuth.ts#L16)

Validates `Authorization: Bearer <API_KEY>` against `env.apiKey`.

## Parameters

### req

`Request`

### \_res

`Response`

### next

`NextFunction`

## Returns

`void`

## Remarks

Mounted on `/api/upload` only.
