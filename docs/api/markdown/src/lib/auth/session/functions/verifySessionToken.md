# Function: verifySessionToken()

> **verifySessionToken**(`token`): `Promise`\<[`SessionUser`](../type-aliases/SessionUser.md)\>

Defined in: [src/lib/auth/session.ts:39](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/session.ts#L39)

Verifies a session JWT and returns the embedded user claims.

## Parameters

### token

`string`

Raw cookie value

## Returns

`Promise`\<[`SessionUser`](../type-aliases/SessionUser.md)\>

## Throws

`AppError` When the token is invalid or missing required claims
