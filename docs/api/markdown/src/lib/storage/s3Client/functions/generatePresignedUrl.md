# Function: generatePresignedUrl()

> **generatePresignedUrl**(`s3Key`, `fileName`): `Promise`\<`string`\>

Defined in: [src/lib/storage/s3Client.ts:92](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/storage/s3Client.ts#L92)

Returns a short-lived presigned GET URL for recipient download.

## Parameters

### s3Key

`string`

Stored object key

### fileName

`string`

Filename sent in `Content-Disposition`

## Returns

`Promise`\<`string`\>

URL valid for 30 seconds
