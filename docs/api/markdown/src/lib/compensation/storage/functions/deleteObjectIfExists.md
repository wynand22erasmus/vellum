# Function: deleteObjectIfExists()

> **deleteObjectIfExists**(`s3Key`): `Promise`\<`void`\>

Defined in: [src/lib/compensation/storage.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/compensation/storage.ts#L14)

Deletes an S3 object if present (idempotent — ignores not-found).

## Parameters

### s3Key

`string`

Object key to remove

## Returns

`Promise`\<`void`\>
