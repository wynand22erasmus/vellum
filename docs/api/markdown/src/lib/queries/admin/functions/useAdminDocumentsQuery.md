# Function: useAdminDocumentsQuery()

> **useAdminDocumentsQuery**(`params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`AdminDocumentRow`](../type-aliases/AdminDocumentRow.md)\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:139](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/queries/admin.ts#L139)

Load paginated admin documents.

## Parameters

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `defaultListParams`

## Returns

`UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`AdminDocumentRow`](../type-aliases/AdminDocumentRow.md)\>\>, `Error`\>
