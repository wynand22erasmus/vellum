# Function: buildMinioPublicEndpoint()

> **buildMinioPublicEndpoint**(): `string`

Defined in: [src/lib/public-url.ts:42](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/public-url.ts#L42)

Browser-reachable MinIO/S3 base URL for presigned downloads.

Uses `MINIO_PUBLIC_ENDPOINT` when set. When `MINIO_ENDPOINT` uses the internal
Compose hostname `minio`, derives `http://{VELLUM_HOST}:9000` so signatures match
what the user's browser can resolve.

## Returns

`string`
