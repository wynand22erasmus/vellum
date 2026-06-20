# Function: parseManifestJson()

> **parseManifestJson**(`raw`): `object`

Defined in: src/server/sftp/parseManifest.ts:28

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
