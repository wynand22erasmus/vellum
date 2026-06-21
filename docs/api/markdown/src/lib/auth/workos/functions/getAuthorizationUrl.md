# Function: getAuthorizationUrl()

> **getAuthorizationUrl**(`returnTo?`): `string`

Defined in: [src/lib/auth/workos.ts:39](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth/workos.ts#L39)

Builds the AuthKit authorization URL for the OAuth redirect flow.

## Parameters

### returnTo?

`string`

Same-origin path to open after sign-in (passed through OAuth `state`)

## Returns

`string`

URL to redirect the browser to WorkOS AuthKit
