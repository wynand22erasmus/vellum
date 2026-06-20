# Function: loadAuthSession()

> **loadAuthSession**(`signal?`): `Promise`\<[`AuthUser`](../../auth/types/interfaces/AuthUser.md) \| `null`\>

Defined in: [src/lib/auth-session.ts:23](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth-session.ts#L23)

Loads the current session user. Deduplicates concurrent calls (e.g. React Strict Mode).

## Parameters

### signal?

`AbortSignal`

Optional abort signal; aborted loads reject and skip shared deduplication

## Returns

`Promise`\<[`AuthUser`](../../auth/types/interfaces/AuthUser.md) \| `null`\>

Authenticated user or `null` when unauthenticated or on error
