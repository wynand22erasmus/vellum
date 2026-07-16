# Function: useAdminCommunicationsQuery()

> **useAdminCommunicationsQuery**(`params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`Communication`](../../../db-api-types/type-aliases/Communication.md)\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:113](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/queries/admin.ts#L113)

Load paginated admin communications.

## Parameters

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `defaultListParams`

## Returns

`UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`Communication`](../../../db-api-types/type-aliases/Communication.md)\>\>, `Error`\>
