# Function: useAdminUsersQuery()

> **useAdminUsersQuery**(`params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`AdminUserRow`](../type-aliases/AdminUserRow.md)\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:104](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/queries/admin.ts#L104)

Load paginated admin users.

## Parameters

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `defaultListParams`

## Returns

`UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`AdminUserRow`](../type-aliases/AdminUserRow.md)\>\>, `Error`\>
