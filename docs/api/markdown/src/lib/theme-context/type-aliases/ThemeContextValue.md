# Type Alias: ThemeContextValue

> **ThemeContextValue** = `object`

Defined in: [src/lib/theme-context.ts:11](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/theme-context.ts#L11)

Theme context value exposed to the component tree.

## Properties

### resolvedTheme

> **resolvedTheme**: `"light"` \| `"dark"`

Defined in: [src/lib/theme-context.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/theme-context.ts#L14)

Resolved light/dark value after applying `system` preference.

***

### setTheme

> **setTheme**: (`theme`) => `void`

Defined in: [src/lib/theme-context.ts:15](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/theme-context.ts#L15)

#### Parameters

##### theme

[`Theme`](../../theme/type-aliases/Theme.md)

#### Returns

`void`

***

### theme

> **theme**: [`Theme`](../../theme/type-aliases/Theme.md)

Defined in: [src/lib/theme-context.ts:12](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/theme-context.ts#L12)

***

### toggleTheme

> **toggleTheme**: () => `void`

Defined in: [src/lib/theme-context.ts:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/theme-context.ts#L17)

Toggles between light and dark based on the current resolved theme.

#### Returns

`void`
