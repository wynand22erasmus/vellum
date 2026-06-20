# Function: getStoredTheme()

> **getStoredTheme**(): [`Theme`](../type-aliases/Theme.md) \| `null`

Defined in: [src/lib/theme.ts:21](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/theme.ts#L21)

Reads the persisted theme from `localStorage`, if any.

## Returns

[`Theme`](../type-aliases/Theme.md) \| `null`

Stored theme or `null` when unset or unavailable (SSR)
