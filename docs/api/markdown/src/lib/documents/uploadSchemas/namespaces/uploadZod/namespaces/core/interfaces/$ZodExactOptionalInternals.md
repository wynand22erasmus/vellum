# Interface: $ZodExactOptionalInternals\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:878

## Extends

- [`$ZodOptionalInternals`]($ZodOptionalInternals.md)\<`T`\>

## Type Parameters

### T

`T` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### def

> **def**: [`$ZodExactOptionalDef`]($ZodExactOptionalDef.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:879

Schema definition.

#### Overrides

[`$ZodOptionalInternals`]($ZodOptionalInternals.md).[`def`]($ZodOptionalInternals.md#def)

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

[`$ZodOptionalInternals`]($ZodOptionalInternals.md).[`toJSONSchema`]($ZodOptionalInternals.md#tojsonschema)

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

[`$ZodOptionalInternals`]($ZodOptionalInternals.md).[`version`]($ZodOptionalInternals.md#version)
