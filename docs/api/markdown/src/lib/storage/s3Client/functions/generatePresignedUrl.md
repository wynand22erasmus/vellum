# Function: generatePresignedUrl()

> **generatePresignedUrl**(`s3Key`, `fileName`): `Promise`\<`string`\>

Defined in: [src/lib/storage/s3Client.ts:92](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/storage/s3Client.ts#L92)

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
