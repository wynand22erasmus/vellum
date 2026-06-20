# Type Alias: DataTableColumnFilter

> **DataTableColumnFilter** = \{ `inputMode?`: `"text"` \| `"email"` \| `"numeric"`; `placeholder?`: `string`; `type`: `"text"`; \} \| \{ `granularity`: `"date"` \| `"datetime"`; `type`: `"datetime"`; \} \| \{ `options`: readonly [`DataTableFilterOption`](DataTableFilterOption.md)[]; `type`: `"multiselect"`; \}

Defined in: [src/lib/data-table-types.ts:27](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/data-table-types.ts#L27)

Per-column filter control configuration (text input, datetime picker, or multiselect).
