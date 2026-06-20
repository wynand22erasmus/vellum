# Interface: $ZodIntersectionInternals\<A, B\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:689

## Extends

- [`_$ZodTypeInternals`]($ZodTypeInternals.md)

## Type Parameters

### A

`A` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

### B

`B` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### def

> **def**: [`$ZodIntersectionDef`]($ZodIntersectionDef.md)\<`A`, `B`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:690

Schema definition.

#### Overrides

[`_$ZodTypeInternals`]($ZodTypeInternals.md).[`def`]($ZodTypeInternals.md#def)

***

### input

> **input**: [`input`](../type-aliases/input.md)\<`A`\> & [`input`](../type-aliases/input.md)\<`B`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:695

***

### output

> **output**: [`output`](../type-aliases/output.md)\<`A`\> & [`output`](../type-aliases/output.md)\<`B`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:694

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
