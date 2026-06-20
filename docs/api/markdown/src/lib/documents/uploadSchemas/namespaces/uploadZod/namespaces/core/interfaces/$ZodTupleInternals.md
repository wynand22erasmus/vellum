# Interface: $ZodTupleInternals\<T, Rest\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:728

## Extends

- [`_$ZodTypeInternals`]($ZodTypeInternals.md)

## Type Parameters

### T

`T` *extends* [`TupleItems`](../../util/type-aliases/TupleItems.md) = readonly [`$ZodType`]($ZodType-1.md)[]

### Rest

`Rest` *extends* [`SomeType`](../type-aliases/SomeType.md) \| `null` = [`$ZodType`]($ZodType-1.md) \| `null`

## Properties

### def

> **def**: [`$ZodTupleDef`]($ZodTupleDef.md)\<`T`, `Rest`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:729

Schema definition.

#### Overrides

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`def`]($ZodTypeInternals.md#def)

***

### input

> **input**: \[`...TupleInputTypeWithOptionals<T>[]`, `...(Rest extends SomeType ? input<Rest>[] : [])[]`\]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:732

***

### output

> **output**: \[`...TupleOutputTypeWithOptionals<T>[]`, `...(Rest extends SomeType ? output<Rest>[] : [])[]`\]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:731

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`toJSONSchema`]($ZodTypeInternals.md#tojsonschema)

***

### version

> **version**: `object`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:42

The `@zod/core` version of this schema

#### major

> `readonly` **major**: `4`

#### minor

> `readonly` **minor**: `4`

#### patch

> `readonly` **patch**: `number`

#### Inherited from

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`version`]($ZodTypeInternals.md#version)
