# Function: verifySessionToken()

> **verifySessionToken**(`token`): `Promise`\<[`SessionUser`](../type-aliases/SessionUser.md)\>

Defined in: [src/lib/auth/session.ts:39](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/session.ts#L39)

Verifies a session JWT and returns the embedded user claims.

## Parameters

### token

`string`

Raw cookie value

## Returns

`Promise`\<[`SessionUser`](../type-aliases/SessionUser.md)\>

## Throws

`AppError` When the token is invalid or missing required claims
