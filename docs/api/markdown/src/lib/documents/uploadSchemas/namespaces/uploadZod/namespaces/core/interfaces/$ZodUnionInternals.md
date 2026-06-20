# Interface: $ZodUnionInternals\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:652

## Extends

- [`_$ZodTypeInternals`]($ZodTypeInternals.md)

## Extended by

- [`$ZodXorInternals`]($ZodXorInternals.md)
- [`$ZodDiscriminatedUnionInternals`]($ZodDiscriminatedUnionInternals.md)

## Type Parameters

### T

`T` *extends* readonly [`SomeType`](../type-aliases/SomeType.md)[] = readonly [`$ZodType`]($ZodType-1.md)[]

## Properties

### def

> **def**: [`$ZodUnionDef`]($ZodUnionDef.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:653

Schema definition.

#### Overrides

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`def`]($ZodTypeInternals.md#def)

***

### input

> **input**: [`$InferUnionInput`](../type-aliases/$InferUnionInput.md)\<`T`\[`number`\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:658

***

### output

> **output**: [`$InferUnionOutput`](../type-aliases/$InferUnionOutput.md)\<`T`\[`number`\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:657

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
