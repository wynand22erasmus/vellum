# Function: dashboardAuth()

> **dashboardAuth**(`req`, `_res`, `next`): `Promise`\<`void`\>

Defined in: [src/server/middleware/devAuth.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/middleware/devAuth.ts#L19)

Populates `req.user` for protected dashboard routes.

## Parameters

### req

`Request`

### \_res

`Response`

### next

`NextFunction`

## Returns

`Promise`\<`void`\>

## Remarks

- **All providers:** `vellum_session` cookie (see `/api/auth/callback` and dev `request-login`).
- **Dev only:** `X-Dev-User-Email` header from the SPA (see `src/lib/api.ts`) as a fallback for API calls.
Mounted on `/api/documents`.
