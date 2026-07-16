# Type Alias: AuthContextValue

> **AuthContextValue** = `object`

Defined in: [src/providers/auth-provider.tsx:20](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/providers/auth-provider.tsx#L20)

Auth context value shared by [useAuthContext](../functions/useAuthContext.md) and [useAuthMe](../functions/useAuthMe.md).

## Properties

### isAdmin

> **isAdmin**: `boolean`

Defined in: [src/providers/auth-provider.tsx:23](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/providers/auth-provider.tsx#L23)

***

### loading

> **loading**: `boolean`

Defined in: [src/providers/auth-provider.tsx:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/providers/auth-provider.tsx#L22)

***

### refresh

> **refresh**: () => `Promise`\<[`AuthUser`](../../../lib/auth/types/interfaces/AuthUser.md) \| `null`\>

Defined in: [src/providers/auth-provider.tsx:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/providers/auth-provider.tsx#L24)

#### Returns

`Promise`\<[`AuthUser`](../../../lib/auth/types/interfaces/AuthUser.md) \| `null`\>

***

### user

> **user**: [`AuthUser`](../../../lib/auth/types/interfaces/AuthUser.md) \| `null`

Defined in: [src/providers/auth-provider.tsx:21](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/providers/auth-provider.tsx#L21)
