# Function: setSessionCookie()

> **setSessionCookie**(`res`, `token`): `void`

Defined in: [src/lib/auth/session.ts:56](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/session.ts#L56)

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
