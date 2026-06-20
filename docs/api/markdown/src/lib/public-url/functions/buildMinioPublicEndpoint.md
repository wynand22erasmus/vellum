# Function: buildMinioPublicEndpoint()

> **buildMinioPublicEndpoint**(): `string`

Defined in: [src/lib/public-url.ts:42](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/public-url.ts#L42)

Browser-reachable MinIO/S3 base URL for presigned downloads.

Uses `MINIO_PUBLIC_ENDPOINT` when set. When `MINIO_ENDPOINT` uses the internal
Compose hostname `minio`, derives `http://{VELLUM_HOST}:9000` so signatures match
what the user's browser can resolve.

## Returns

`string`
