# Function: createSessionToken()

> **createSessionToken**(`user`): `Promise`\<`string`\>

Defined in: [src/lib/auth/session.ts:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/session.ts#L24)

Signs a session cookie value for the authenticated dashboard user.

## Parameters

### user

[`SessionUser`](../type-aliases/SessionUser.md)

User id and email from WorkOS or dev login

## Returns

`Promise`\<`string`\>
