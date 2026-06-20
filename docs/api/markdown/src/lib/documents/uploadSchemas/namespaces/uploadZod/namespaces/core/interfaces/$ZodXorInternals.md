# Interface: $ZodXorInternals\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:666

## Extends

- [`$ZodUnionInternals`]($ZodUnionInternals.md)\<`T`\>

## Type Parameters

### T

`T` *extends* readonly [`SomeType`](../type-aliases/SomeType.md)[] = readonly [`$ZodType`]($ZodType-1.md)[]

## Properties

### def

> **def**: [`$ZodUnionDef`]($ZodUnionDef.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:653

Schema definition.

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`def`]($ZodUnionInternals.md#def)

***

### input

> **input**: [`$InferUnionInput`](../type-aliases/$InferUnionInput.md)\<`T`\[`number`\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:658

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`input`]($ZodUnionInternals.md#input)

***

### output

> **output**: [`$InferUnionOutput`](../type-aliases/$InferUnionOutput.md)\<`T`\[`number`\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:657

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`output`]($ZodUnionInternals.md#output)

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`toJSONSchema`]($ZodUnionInternals.md#tojsonschema)

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

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`version`]($ZodUnionInternals.md#version)
