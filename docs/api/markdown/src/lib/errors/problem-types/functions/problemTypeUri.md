# Function: problemTypeUri()

> **problemTypeUri**(`slug`): `string`

Defined in: [src/lib/errors/problem-types.ts:49](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/problem-types.ts#L49)

Builds the canonical `type` URI for a problem slug.

## Parameters

### slug

`"validation-error"` \| `"unauthorized"` \| `"forbidden"` \| `"not-found"` \| `"gone"` \| `"unprocessable-content"` \| `"too-many-requests"` \| `"internal-error"` \| `"service-unavailable"` \| `"upload-rejected"` \| `"partial-failure"`

Problem type identifier

## Returns

`string`
