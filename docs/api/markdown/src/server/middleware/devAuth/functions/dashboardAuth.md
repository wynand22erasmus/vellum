# Function: dashboardAuth()

> **dashboardAuth**(`req`, `_res`, `next`): `Promise`\<`void`\>

Defined in: [src/server/middleware/devAuth.ts:19](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/middleware/devAuth.ts#L19)

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
