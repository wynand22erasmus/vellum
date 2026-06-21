# Function: resolveUploadFileName()

> **resolveUploadFileName**(`originalName`, `allowedExtensions`): `object`

Defined in: [src/lib/uploadFilename.ts:174](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/uploadFilename.ts#L174)

Produces a storage-safe filename and validates the effective extension.

## Parameters

### originalName

`string`

Multipart `originalname`

### allowedExtensions

readonly `string`[]

Lowercase extensions without leading dots; may include `*` to allow all

## Returns

`object`

### effectiveExtension

> **effectiveExtension**: `string`

### safeFileName

> **safeFileName**: `string`

## Throws

`AppError` When the filename is invalid or the extension is disallowed
