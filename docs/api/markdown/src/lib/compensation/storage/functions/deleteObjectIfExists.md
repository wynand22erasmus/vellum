# Function: deleteObjectIfExists()

> **deleteObjectIfExists**(`s3Key`): `Promise`\<`void`\>

Defined in: [src/lib/compensation/storage.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/compensation/storage.ts#L14)

Deletes an S3 object if present (idempotent — ignores not-found).

## Parameters

### s3Key

`string`

Object key to remove

## Returns

`Promise`\<`void`\>
