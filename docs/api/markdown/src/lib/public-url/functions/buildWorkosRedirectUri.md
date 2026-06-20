# Function: buildWorkosRedirectUri()

> **buildWorkosRedirectUri**(): `string`

Defined in: [src/lib/public-url.ts:67](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/public-url.ts#L67)

WorkOS OAuth callback URL.

Uses `WORKOS_REDIRECT_URI` when set; otherwise `{@link buildPublicUrl}/api/auth/callback`.

## Returns

`string`
