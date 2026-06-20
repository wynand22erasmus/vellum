# Interface: $ZodDiscriminatedUnionInternals\<Options, Disc\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:676

## Extends

- [`$ZodUnionInternals`]($ZodUnionInternals.md)\<`Options`\>

## Type Parameters

### Options

`Options` *extends* readonly [`SomeType`](../type-aliases/SomeType.md)[] = readonly [`$ZodType`]($ZodType-1.md)[]

### Disc

`Disc` *extends* `string` = `string`

## Properties

### def

> **def**: [`$ZodDiscriminatedUnionDef`]($ZodDiscriminatedUnionDef.md)\<`Options`, `Disc`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:677

Schema definition.

#### Overrides

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`def`]($ZodUnionInternals.md#def)

***

### input

> **input**: [`$InferUnionInput`](../type-aliases/$InferUnionInput.md)\<`Options`\[`number`\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:658

#### Inherited from

[`$ZodUnionInternals`]($ZodUnionInternals.md).[`input`]($ZodUnionInternals.md#input)

***

### output

> **output**: [`$InferUnionOutput`](../type-aliases/$InferUnionOutput.md)\<`Options`\[`number`\]\>

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
