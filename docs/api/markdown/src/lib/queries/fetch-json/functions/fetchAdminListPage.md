# Function: fetchAdminListPage()

> **fetchAdminListPage**\<`T`\>(`endpoint`, `dataKey`, `params?`): `Promise`\<[`AdminListResult`](../type-aliases/AdminListResult.md)\<`T`\>\>

Defined in: [src/lib/queries/fetch-json.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/queries/fetch-json.ts#L19)

Fetch a paginated admin list with optional server-side filters.

## Type Parameters

### T

`T`

## Parameters

### endpoint

`string`

### dataKey

`string`

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `{}`

## Returns

`Promise`\<[`AdminListResult`](../type-aliases/AdminListResult.md)\<`T`\>\>
