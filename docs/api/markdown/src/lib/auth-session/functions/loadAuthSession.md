# Function: loadAuthSession()

> **loadAuthSession**(`signal?`): `Promise`\<[`AuthUser`](../../auth/types/interfaces/AuthUser.md) \| `null`\>

Defined in: [src/lib/auth-session.ts:23](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth-session.ts#L23)

Loads the current session user. Deduplicates concurrent calls (e.g. React Strict Mode).

## Parameters

### signal?

`AbortSignal`

Optional abort signal; aborted loads reject and skip shared deduplication

## Returns

`Promise`\<[`AuthUser`](../../auth/types/interfaces/AuthUser.md) \| `null`\>

Authenticated user or `null` when unauthenticated or on error
