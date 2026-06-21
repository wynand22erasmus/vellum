# Type Alias: DataTableColumn\<T\>

> **DataTableColumn**\<`T`\> = `object`

Defined in: [src/lib/data-table-types.ts:33](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L33)

Column metadata for `DataTable` headers, sorting, and filtering.

## Type Parameters

### T

`T`

## Properties

### accessorFn

> **accessorFn**: (`row`) => `unknown`

Defined in: [src/lib/data-table-types.ts:36](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L36)

#### Parameters

##### row

`T`

#### Returns

`unknown`

***

### cell?

> `optional` **cell?**: (`context`) => `React.ReactNode`

Defined in: [src/lib/data-table-types.ts:37](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L37)

#### Parameters

##### context

###### row

`T`

###### value

`unknown`

#### Returns

`React.ReactNode`

***

### className?

> `optional` **className?**: `string`

Defined in: [src/lib/data-table-types.ts:48](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L48)

***

### dataType?

> `optional` **dataType?**: [`DataTableColumnDataType`](DataTableColumnDataType.md)

Defined in: [src/lib/data-table-types.ts:38](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L38)

***

### enableFiltering?

> `optional` **enableFiltering?**: `boolean`

Defined in: [src/lib/data-table-types.ts:41](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L41)

***

### enableSorting?

> `optional` **enableSorting?**: `boolean`

Defined in: [src/lib/data-table-types.ts:40](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L40)

***

### enumOptions?

> `optional` **enumOptions?**: readonly [`DataTableFilterOption`](DataTableFilterOption.md)[]

Defined in: [src/lib/data-table-types.ts:39](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L39)

***

### filter?

> `optional` **filter?**: [`DataTableColumnFilter`](DataTableColumnFilter.md) \| `false`

Defined in: [src/lib/data-table-types.ts:43](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L43)

Explicit filter config, `false` to disable, or omit to infer from `dataType`.

***

### filterFn?

> `optional` **filterFn?**: (`cellValue`, `filterValue`) => `boolean`

Defined in: [src/lib/data-table-types.ts:46](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L46)

#### Parameters

##### cellValue

`unknown`

##### filterValue

`string`

#### Returns

`boolean`

***

### filterOnly?

> `optional` **filterOnly?**: `boolean`

Defined in: [src/lib/data-table-types.ts:51](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L51)

When true, column appears in the header only (filter/sort), not in body rows.

***

### header

> **header**: `React.ReactNode`

Defined in: [src/lib/data-table-types.ts:35](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L35)

***

### headerClassName?

> `optional` **headerClassName?**: `string`

Defined in: [src/lib/data-table-types.ts:49](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L49)

***

### id

> **id**: `string`

Defined in: [src/lib/data-table-types.ts:34](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L34)

***

### ~~sortable?~~

> `optional` **sortable?**: `boolean`

Defined in: [src/lib/data-table-types.ts:45](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L45)

#### Deprecated

Prefer `enableSorting`.

***

### sortFn?

> `optional` **sortFn?**: (`rowA`, `rowB`, `sort`) => `number`

Defined in: [src/lib/data-table-types.ts:47](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-types.ts#L47)

#### Parameters

##### rowA

`T`

##### rowB

`T`

##### sort

[`DataTableSort`](../../data-table-utils/type-aliases/DataTableSort.md)

#### Returns

`number`
