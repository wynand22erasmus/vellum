# Interface: $ZodCodecDef\<A, B\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1022

## Extends

- [`$ZodPipeDef`]($ZodPipeDef.md)\<`A`, `B`\>

## Type Parameters

### A

`A` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

### B

`B` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### checks?

> `optional` **checks?**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:38

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`checks`]($ZodPipeDef.md#checks)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:37

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`error`]($ZodPipeDef.md#error)

***

### in

> **in**: `A`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1003

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`in`]($ZodPipeDef.md#in)

***

### out

> **out**: `B`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1004

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`out`]($ZodPipeDef.md#out)

***

### reverseTransform

> **reverseTransform**: (`value`, `payload`) => [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`output`](../type-aliases/output.md)\<`A`\>\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1024

Only defined inside $ZodCodec instances.

#### Parameters

##### value

[`input`](../type-aliases/input.md)\<`B`\>

##### payload

[`ParsePayload`](ParsePayload.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`output`](../type-aliases/output.md)\<`A`\>\>

#### Overrides

[`$ZodPipeDef`]($ZodPipeDef.md).[`reverseTransform`]($ZodPipeDef.md#reversetransform)

***

### transform

> **transform**: (`value`, `payload`) => [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1023

Only defined inside $ZodCodec instances.

#### Parameters

##### value

[`output`](../type-aliases/output.md)\<`A`\>

##### payload

[`ParsePayload`](ParsePayload.md)\<[`output`](../type-aliases/output.md)\<`A`\>\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

#### Overrides

[`$ZodPipeDef`]($ZodPipeDef.md).[`transform`]($ZodPipeDef.md#transform)

***

### type

> **type**: `"pipe"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1002

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`type`]($ZodPipeDef.md#type)
