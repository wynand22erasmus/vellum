# Function: useAdminFilesQuery()

> **useAdminFilesQuery**(`params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`File`](../../../db-api-types/type-aliases/File.md)\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:73](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/queries/admin.ts#L73)

Load paginated admin files.

## Parameters

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `defaultListParams`

## Returns

`UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`File`](../../../db-api-types/type-aliases/File.md)\>\>, `Error`\>
