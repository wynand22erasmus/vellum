# Type Alias: DataTableColumnFilter

> **DataTableColumnFilter** = \{ `inputMode?`: `"text"` \| `"email"` \| `"numeric"`; `placeholder?`: `string`; `type`: `"text"`; \} \| \{ `granularity`: `"date"` \| `"datetime"`; `type`: `"datetime"`; \} \| \{ `options`: readonly [`DataTableFilterOption`](DataTableFilterOption.md)[]; `type`: `"multiselect"`; \}

Defined in: [src/lib/data-table-types.ts:27](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L27)

Per-column filter control configuration (text input, datetime picker, or multiselect).
