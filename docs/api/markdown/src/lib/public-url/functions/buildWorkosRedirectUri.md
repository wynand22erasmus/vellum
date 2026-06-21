# Function: buildWorkosRedirectUri()

> **buildWorkosRedirectUri**(): `string`

Defined in: [src/lib/public-url.ts:69](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/public-url.ts#L69)

WorkOS OAuth callback URL.

Uses `WORKOS_REDIRECT_URI` when set; otherwise `{@link buildPublicUrl}/api/auth/callback`.

## Returns

`string`
