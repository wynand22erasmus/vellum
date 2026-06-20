# Interface: $ZodCatchDef\<T\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:974

## Extends

- [`$ZodTypeDef`]($ZodTypeDef.md)

## Type Parameters

### T

`T` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### catchValue

> **catchValue**: (`ctx`) => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:977

#### Parameters

##### ctx

[`$ZodCatchCtx`]($ZodCatchCtx.md)

#### Returns

`unknown`

***

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

### innerType

> **innerType**: `T`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:976

***

### type

> **type**: `"catch"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:975

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)
