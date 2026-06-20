# Function: requestId()

> **requestId**(`req`, `res`, `next`): `void`

Defined in: [src/server/middleware/requestId.ts:13](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/middleware/requestId.ts#L13)

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
