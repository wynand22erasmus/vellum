# Function: useAdminListPageQuery()

> **useAdminListPageQuery**\<`T`\>(`endpoint`, `dataKey`, `params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<`T`\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:53](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/queries/admin.ts#L53)

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
