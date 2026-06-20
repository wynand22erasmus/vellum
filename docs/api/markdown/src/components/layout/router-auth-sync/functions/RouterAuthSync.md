# Function: RouterAuthSync()

> **RouterAuthSync**(`__namedParameters`): `null`

Defined in: [src/components/layout/router-auth-sync.tsx:11](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/layout/router-auth-sync.tsx#L11)

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
