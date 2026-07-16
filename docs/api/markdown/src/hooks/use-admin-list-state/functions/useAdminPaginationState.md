# Function: useAdminPaginationState()

> **useAdminPaginationState**(`pageSize?`): `object`

Defined in: [src/hooks/use-admin-list-state.ts:57](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/hooks/use-admin-list-state.ts#L57)

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
