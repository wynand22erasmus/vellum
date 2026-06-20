# Interface: $ZodArrayInternals\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:563

## Extends

- [`_$ZodTypeInternals`]($ZodTypeInternals.md)

## Type Parameters

### T

`T` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### def

> **def**: [`$ZodArrayDef`]($ZodArrayDef.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:564

Schema definition.

#### Overrides

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`def`]($ZodTypeInternals.md#def)

***

### input

> **input**: [`input`](../type-aliases/input.md)\<`T`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:567

***

### output

> **output**: [`output`](../type-aliases/output.md)\<`T`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:566

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
