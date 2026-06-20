# Interface: $ZodDefaultDef\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:903

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

> **defaultValue**: [`NoUndefined`](../../util/type-aliases/NoUndefined.md)\<[`output`](../type-aliases/output.md)\<`T`\>\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:907

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

Defined in: node\_modules/zod/v4/core/schemas.d.cts:905

***

### type

> **type**: `"default"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:904

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)
