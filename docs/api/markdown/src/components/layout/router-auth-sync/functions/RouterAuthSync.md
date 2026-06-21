# Function: RouterAuthSync()

> **RouterAuthSync**(`__namedParameters`): `null`

Defined in: [src/components/layout/router-auth-sync.tsx:11](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/layout/router-auth-sync.tsx#L11)

Invalidate the router when session state changes (login/logout/refresh).

## Parameters

### \_\_namedParameters

#### auth

[`AuthContextValue`](../../../../providers/auth-provider/type-aliases/AuthContextValue.md)

#### router

\{ `invalidate`: () => `Promise`\<`void`\>; \}

#### router.invalidate

() => `Promise`\<`void`\>

## Returns

`null`
