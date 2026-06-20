# Function: buildPublicUrl()

> **buildPublicUrl**(): `string`

Defined in: [src/lib/public-url.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/public-url.ts#L14)

Public base URL for the app (no trailing slash).

Uses `APP_URL` when set; otherwise derives from `VELLUM_HOST`, `VELLUM_PUBLIC_SCHEME`,
and `VELLUM_PUBLIC_PORT`.

## Returns

`string`
