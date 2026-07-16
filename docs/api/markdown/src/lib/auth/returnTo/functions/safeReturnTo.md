# Function: safeReturnTo()

> **safeReturnTo**(`value`): `string`

Defined in: [src/lib/auth/returnTo.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/returnTo.ts#L14)

Returns a same-origin path safe to use after login, or the default dashboard path.

## Parameters

### value

`string` \| `undefined`

Raw `returnTo` query value

## Returns

`string`
