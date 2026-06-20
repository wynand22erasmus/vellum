# Function: setSessionCookie()

> **setSessionCookie**(`res`, `token`): `void`

Defined in: [src/lib/auth/session.ts:56](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/session.ts#L56)

Sets the HTTP-only dashboard session cookie on the response.

## Parameters

### res

`Response`

Express response

### token

`string`

JWT from [createSessionToken](createSessionToken.md)

## Returns

`void`
