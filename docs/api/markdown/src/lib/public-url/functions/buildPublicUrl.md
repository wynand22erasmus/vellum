# Function: buildPublicUrl()

> **buildPublicUrl**(): `string`

Defined in: [src/lib/public-url.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/public-url.ts#L14)

Public base URL for the app (no trailing slash).

Uses `APP_URL` when set; otherwise derives from `VELLUM_HOST`, `VELLUM_PUBLIC_SCHEME`,
and `VELLUM_PUBLIC_PORT`.

## Returns

`string`
