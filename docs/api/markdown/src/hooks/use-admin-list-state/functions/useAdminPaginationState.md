# Function: useAdminPaginationState()

> **useAdminPaginationState**(`pageSize?`): `object`

Defined in: [src/hooks/use-admin-list-state.ts:57](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/hooks/use-admin-list-state.ts#L57)

Server pagination without column filters.

## Parameters

### pageSize?

`number` = `ADMIN_DEFAULT_PAGE_SIZE`

## Returns

`object`

### pageIndex

> **pageIndex**: `number`

### pageSize

> **pageSize**: `number`

### queryParams

> **queryParams**: [`AdminListParams`](../../../lib/queries/query-keys/type-aliases/AdminListParams.md)

### setPageIndex

> **setPageIndex**: `Dispatch`\<`SetStateAction`\<`number`\>\>
