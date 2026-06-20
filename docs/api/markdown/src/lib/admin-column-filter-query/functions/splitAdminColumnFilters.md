# Function: splitAdminColumnFilters()

> **splitAdminColumnFilters**(`filters`): `object`

Defined in: [src/lib/admin-column-filter-query.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/admin-column-filter-query.ts#L14)

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
