# Type Alias: AdminListPageProps\<T\>

> **AdminListPageProps**\<`T`\> = `object`

Defined in: [src/pages/admin/admin-list-page.tsx:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L17)

Props for [AdminListPage](../functions/AdminListPage.md).

## Type Parameters

### T

`T`

## Properties

### clientColumnFilters?

> `optional` **clientColumnFilters?**: `ColumnFiltersState`

Defined in: [src/pages/admin/admin-list-page.tsx:27](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L27)

***

### columnFilters?

> `optional` **columnFilters?**: `ColumnFiltersState`

Defined in: [src/pages/admin/admin-list-page.tsx:26](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L26)

***

### columns

> **columns**: `ColumnDef`\<`T`\>[]

Defined in: [src/pages/admin/admin-list-page.tsx:21](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L21)

***

### description

> **description**: `string`

Defined in: [src/pages/admin/admin-list-page.tsx:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L19)

***

### emptyTitle?

> `optional` **emptyTitle?**: `string`

Defined in: [src/pages/admin/admin-list-page.tsx:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L22)

***

### onColumnFiltersChange?

> `optional` **onColumnFiltersChange?**: (`filters`) => `void`

Defined in: [src/pages/admin/admin-list-page.tsx:28](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L28)

#### Parameters

##### filters

`ColumnFiltersState`

#### Returns

`void`

***

### onPageChange?

> `optional` **onPageChange?**: (`pageIndex`) => `void`

Defined in: [src/pages/admin/admin-list-page.tsx:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L24)

#### Parameters

##### pageIndex

`number`

#### Returns

`void`

***

### pageIndex?

> `optional` **pageIndex?**: `number`

Defined in: [src/pages/admin/admin-list-page.tsx:23](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L23)

***

### pageSize?

> `optional` **pageSize?**: `number`

Defined in: [src/pages/admin/admin-list-page.tsx:25](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L25)

***

### query

> **query**: `UseQueryResult`\<[`AdminListResult`](../../../../lib/queries/fetch-json/type-aliases/AdminListResult.md)\<`T`\>, `Error`\>

Defined in: [src/pages/admin/admin-list-page.tsx:20](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L20)

***

### serverFiltering?

> `optional` **serverFiltering?**: `boolean`

Defined in: [src/pages/admin/admin-list-page.tsx:29](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L29)

***

### title

> **title**: `string`

Defined in: [src/pages/admin/admin-list-page.tsx:18](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/pages/admin/admin-list-page.tsx#L18)
