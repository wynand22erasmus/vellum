# Function: parseAllowedUploadExtensionsFromEnv()

> **parseAllowedUploadExtensionsFromEnv**(`raw`): `string`[]

Defined in: [src/lib/uploadFilename.ts:96](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/uploadFilename.ts#L96)

Parses `ALLOWED_UPLOAD_EXTENSIONS` JSON array. Unset/invalid/empty-after-normalize → defaults.
Include `"*"` as an entry to allow any extension (sanitization still runs).

## Parameters

### raw

`string` \| `undefined`

## Returns

`string`[]
