# Function: parseManifestJson()

> **parseManifestJson**(`raw`): `object`

Defined in: [src/server/sftp/parseManifest.ts:28](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/sftp/parseManifest.ts#L28)

Parses and validates a JSON manifest buffer.

## Parameters

### raw

`string` \| `Buffer`\<`ArrayBufferLike`\>

## Returns

`object`

### fileTtl

> **fileTtl**: `number`

### linkTtl

> **linkTtl**: `number`

### password

> **password**: `string`

### recipientEmail

> **recipientEmail**: `string`

## Throws

When fields are missing or invalid
