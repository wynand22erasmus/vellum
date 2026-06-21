# Function: useAdminListState()

> **useAdminListState**(`pageSize?`): `object`

Defined in: [src/hooks/use-admin-list-state.ts:16](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/hooks/use-admin-list-state.ts#L16)

Manage column header filters (server-backed) and pagination.

## Parameters

### pageSize?

`number` = `ADMIN_DEFAULT_PAGE_SIZE`

## Returns

`object`

### clientColumnFilters

> **clientColumnFilters**: `ColumnFiltersState` = `clientFilters`

### columnFilters

> **columnFilters**: `ColumnFiltersState`

### onClearColumnFilters

> **onClearColumnFilters**: () => `void`

#### Returns

`void`

### onColumnFiltersChange

> **onColumnFiltersChange**: (`filters`) => `void`

#### Parameters

##### filters

`ColumnFiltersState`

#### Returns

`void`

### pageIndex

> **pageIndex**: `number`

### pageSize

> **pageSize**: `number`

### queryParams

> **queryParams**: [`AdminListParams`](../../../lib/queries/query-keys/type-aliases/AdminListParams.md)

### setPageIndex

> **setPageIndex**: `Dispatch`\<`SetStateAction`\<`number`\>\>
