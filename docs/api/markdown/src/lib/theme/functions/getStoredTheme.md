# Function: getStoredTheme()

> **getStoredTheme**(): [`Theme`](../type-aliases/Theme.md) \| `null`

Defined in: [src/lib/theme.ts:21](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/theme.ts#L21)

Reads the persisted theme from `localStorage`, if any.

## Returns

[`Theme`](../type-aliases/Theme.md) \| `null`

Stored theme or `null` when unset or unavailable (SSR)
