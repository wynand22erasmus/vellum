# Function: useAdminDocumentsQuery()

> **useAdminDocumentsQuery**(`params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`Document`](../../../db-api-types/type-aliases/Document.md)\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:136](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/queries/admin.ts#L136)

Load paginated admin document envelopes.

## Parameters

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `defaultListParams`

## Returns

`UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`Document`](../../../db-api-types/type-aliases/Document.md)\>\>, `Error`\>
