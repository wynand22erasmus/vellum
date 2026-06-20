# Function: getAuthorizationUrl()

> **getAuthorizationUrl**(`returnTo?`): `string`

Defined in: [src/lib/auth/workos.ts:39](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth/workos.ts#L39)

Builds the AuthKit authorization URL for the OAuth redirect flow.

## Parameters

### returnTo?

`string`

Same-origin path to open after sign-in (passed through OAuth `state`)

## Returns

`string`

URL to redirect the browser to WorkOS AuthKit
