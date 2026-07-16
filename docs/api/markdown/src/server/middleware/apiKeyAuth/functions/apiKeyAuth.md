# Function: apiKeyAuth()

> **apiKeyAuth**(`req`, `_res`, `next`): `void`

Defined in: [src/server/middleware/apiKeyAuth.ts:16](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/middleware/apiKeyAuth.ts#L16)

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
