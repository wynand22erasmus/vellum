# Function: filterFnIdForDataType()

> **filterFnIdForDataType**(`dataType`, `filter?`): `"number"` \| `"date"` \| `"text"` \| `"multiSelect"` \| `"dateTime"`

Defined in: [src/components/data-table/tanstack-filter-fns.ts:57](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/components/data-table/tanstack-filter-fns.ts#L57)

Maps column data type to a registered TanStack filter fn id.

## Parameters

### dataType

[`DataTableColumnDataType`](../../../../lib/data-table-types/type-aliases/DataTableColumnDataType.md) \| `undefined`

### filter?

`false` \| [`DataTableColumnFilter`](../../../../lib/data-table-types/type-aliases/DataTableColumnFilter.md)

## Returns

`"number"` \| `"date"` \| `"text"` \| `"multiSelect"` \| `"dateTime"`
