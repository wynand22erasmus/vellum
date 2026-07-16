# Function: splitAdminColumnFilters()

> **splitAdminColumnFilters**(`filters`): `object`

Defined in: [src/lib/admin-column-filter-query.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/admin-column-filter-query.ts#L14)

Splits column filters into server query params and client-only filters.

## Parameters

### filters

`ColumnFiltersState`

## Returns

`object`

### clientFilters

> **clientFilters**: `ColumnFiltersState`

### serverParams

> **serverParams**: `Record`\<`string`, `string`\>
