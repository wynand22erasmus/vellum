# Function: useAdminListPageQuery()

> **useAdminListPageQuery**\<`T`\>(`endpoint`, `dataKey`, `params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<`T`\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:92](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/queries/admin.ts#L92)

Generic admin list hook keyed by endpoint and response field.

## Type Parameters

### T

`T`

## Parameters

### endpoint

`string`

### dataKey

`string`

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `defaultListParams`

## Returns

`UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<`T`\>\>, `Error`\>
