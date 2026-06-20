# Function: createSessionToken()

> **createSessionToken**(`user`): `Promise`\<`string`\>

Defined in: [src/lib/auth/session.ts:24](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/session.ts#L24)

Signs a session cookie value for the authenticated dashboard user.

## Parameters

### user

[`SessionUser`](../type-aliases/SessionUser.md)

User id and email from WorkOS or dev login

## Returns

`Promise`\<`string`\>
