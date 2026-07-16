# Type Alias: DataTableColumnFilterConfig\<T\>

> **DataTableColumnFilterConfig**\<`T`\> = `object`

Defined in: [src/lib/data-table-utils.ts:207](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-utils.ts#L207)

Per-column filter wiring passed to [filterDataTableRows](../functions/filterDataTableRows.md).

## Type Parameters

### T

`T`

## Properties

### filterFn?

> `optional` **filterFn?**: (`cellValue`, `filterValue`) => `boolean`

Defined in: [src/lib/data-table-utils.ts:210](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-utils.ts#L210)

#### Parameters

##### cellValue

`unknown`

##### filterValue

`string`

#### Returns

`boolean`

***

### getFilterValue

> **getFilterValue**: (`row`) => `unknown`

Defined in: [src/lib/data-table-utils.ts:209](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-utils.ts#L209)

#### Parameters

##### row

`T`

#### Returns

`unknown`

***

### id

> **id**: `string`

Defined in: [src/lib/data-table-utils.ts:208](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/data-table-utils.ts#L208)
