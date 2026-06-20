# Function: filterFnIdForDataType()

> **filterFnIdForDataType**(`dataType`, `filter?`): `"number"` \| `"date"` \| `"text"` \| `"multiSelect"` \| `"dateTime"`

Defined in: [src/components/data-table/tanstack-filter-fns.ts:57](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/components/data-table/tanstack-filter-fns.ts#L57)

Maps column data type to a registered TanStack filter fn id.

## Parameters

### dataType

[`DataTableColumnDataType`](../../../../lib/data-table-types/type-aliases/DataTableColumnDataType.md) \| `undefined`

### filter?

`false` \| [`DataTableColumnFilter`](../../../../lib/data-table-types/type-aliases/DataTableColumnFilter.md)

## Returns

`"number"` \| `"date"` \| `"text"` \| `"multiSelect"` \| `"dateTime"`
