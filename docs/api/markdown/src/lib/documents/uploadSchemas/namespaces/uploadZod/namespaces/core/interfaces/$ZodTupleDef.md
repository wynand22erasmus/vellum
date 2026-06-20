# Interface: $ZodTupleDef\<T, Rest\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:701

## Extends

- [`$ZodTypeDef`]($ZodTypeDef.md)

## Type Parameters

### T

`T` *extends* [`TupleItems`](../../util/type-aliases/TupleItems.md) = readonly [`$ZodType`]($ZodType-1.md)[]

### Rest

`Rest` *extends* [`SomeType`](../type-aliases/SomeType.md) \| `null` = [`$ZodType`]($ZodType-1.md) \| `null`

## Properties

### checks?

> `optional` **checks?**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:38

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`checks`]($ZodTypeDef.md#checks)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:37

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`error`]($ZodTypeDef.md#error)

***

### items

> **items**: `T`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:703

***

### rest

> **rest**: `Rest`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:704

***

### type

> **type**: `"tuple"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:702

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)
