# Function: getDefaultFilterFnForColumn()

> **getDefaultFilterFnForColumn**\<`T`\>(`column`): (`cellValue`, `filterValue`) => `boolean`

Defined in: [src/lib/data-table-column-config.ts:98](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-column-config.ts#L98)

Default row filter for a column based on its resolved filter / data type.

## Type Parameters

### T

`T`

## Parameters

### column

[`DataTableColumn`](../../data-table-types/type-aliases/DataTableColumn.md)\<`T`\>

## Returns

> (`cellValue`, `filterValue`): `boolean`

Datetime filter: rows match when the cell UTC timestamp falls in the selected minute.

### Parameters

#### cellValue

`unknown`

#### filterValue

`string`

### Returns

`boolean`
