# Function: requestId()

> **requestId**(`req`, `res`, `next`): `void`

Defined in: [src/server/middleware/requestId.ts:13](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/middleware/requestId.ts#L13)

Sets `X-Request-Id` on the response from `X-Request-Id` header or a new UUID.

## Parameters

### req

`Request`

### res

`Response`

### next

`NextFunction`

## Returns

`void`
