# Function: problemTypeUri()

> **problemTypeUri**(`slug`): `string`

Defined in: [src/lib/errors/problem-types.ts:49](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/problem-types.ts#L49)

Builds the canonical `type` URI for a problem slug.

## Parameters

### slug

`"validation-error"` \| `"unauthorized"` \| `"forbidden"` \| `"not-found"` \| `"gone"` \| `"unprocessable-content"` \| `"too-many-requests"` \| `"internal-error"` \| `"service-unavailable"` \| `"upload-rejected"` \| `"partial-failure"`

Problem type identifier

## Returns

`string`
