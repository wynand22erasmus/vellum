# Function: parseAllowedUploadExtensionsFromEnv()

> **parseAllowedUploadExtensionsFromEnv**(`raw`): `string`[]

Defined in: [src/lib/uploadFilename.ts:96](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/uploadFilename.ts#L96)

Parses `ALLOWED_UPLOAD_EXTENSIONS` JSON array. Unset/invalid/empty-after-normalize → defaults.
Include `"*"` as an entry to allow any extension (sanitization still runs).

## Parameters

### raw

`string` \| `undefined`

## Returns

`string`[]
