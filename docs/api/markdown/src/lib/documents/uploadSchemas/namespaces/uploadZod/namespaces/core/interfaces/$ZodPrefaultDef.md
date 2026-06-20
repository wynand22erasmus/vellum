# Interface: $ZodPrefaultDef\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:920

## Extends

- [`$ZodTypeDef`]($ZodTypeDef.md)

## Type Parameters

### T

`T` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### checks?

> `optional` **checks?**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:38

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`checks`]($ZodTypeDef.md#checks)

***

### defaultValue

> **defaultValue**: [`input`](../type-aliases/input.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:924

The default value. May be a getter.

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:37

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`error`]($ZodTypeDef.md#error)

***

### innerType

> **innerType**: `T`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:922

***

### type

> **type**: `"prefault"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:921

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)
