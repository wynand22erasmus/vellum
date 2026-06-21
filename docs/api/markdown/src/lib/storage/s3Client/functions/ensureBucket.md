# Function: ensureBucket()

> **ensureBucket**(): `Promise`\<`void`\>

Defined in: [src/lib/storage/s3Client.ts:41](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/storage/s3Client.ts#L41)

Ensures the configured bucket exists, creating it when missing.

## Returns

`Promise`\<`void`\>

## Remarks

Safe to call at startup; upload path retries on failure.
