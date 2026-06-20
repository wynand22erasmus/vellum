# Function: uploadObject()

> **uploadObject**(`key`, `body`, `contentType`): `Promise`\<`void`\>

Defined in: [src/lib/storage/s3Client.ts:56](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/storage/s3Client.ts#L56)

Uploads a buffer to the documents bucket.

## Parameters

### key

`string`

Object key (typically document id)

### body

`Buffer`

File bytes

### contentType

`string`

MIME type for `Content-Type`

## Returns

`Promise`\<`void`\>
