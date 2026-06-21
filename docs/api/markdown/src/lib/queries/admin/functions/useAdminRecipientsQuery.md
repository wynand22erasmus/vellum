# Function: useAdminRecipientsQuery()

> **useAdminRecipientsQuery**(`params?`): `UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`Recipient`](../../../db-api-types/type-aliases/Recipient.md)\>\>, `Error`\>

Defined in: [src/lib/queries/admin.ts:93](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/queries/admin.ts#L93)

Load paginated admin recipients.

## Parameters

### params?

[`AdminListParams`](../../query-keys/type-aliases/AdminListParams.md) = `defaultListParams`

## Returns

`UseQueryResult`\<`NoInfer`\<[`AdminListResult`](../../fetch-json/type-aliases/AdminListResult.md)\<[`Recipient`](../../../db-api-types/type-aliases/Recipient.md)\>\>, `Error`\>
