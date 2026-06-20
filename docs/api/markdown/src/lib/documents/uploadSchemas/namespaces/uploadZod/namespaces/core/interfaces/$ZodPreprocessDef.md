# Interface: $ZodPreprocessDef\<B\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1038

## Extends

- [`$ZodPipeDef`]($ZodPipeDef.md)\<[`$ZodTransform`]($ZodTransform.md), `B`\>

## Type Parameters

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

> **in**: [`$ZodTransform`]($ZodTransform.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1039

#### Overrides

[`$ZodPipeDef`]($ZodPipeDef.md).[`in`]($ZodPipeDef.md#in)

***

### out

> **out**: `B`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1040

#### Overrides

[`$ZodPipeDef`]($ZodPipeDef.md).[`out`]($ZodPipeDef.md#out)

***

### reverseTransform?

> `optional` **reverseTransform?**: (`value`, `payload`) => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1008

Only defined inside $ZodCodec instances.

#### Parameters

##### value

[`input`](../type-aliases/input.md)\<`B`\>

##### payload

[`ParsePayload`](ParsePayload.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

#### Returns

`unknown`

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`reverseTransform`]($ZodPipeDef.md#reversetransform)

***

### transform?

> `optional` **transform?**: (`value`, `payload`) => [`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1006

Only defined inside $ZodCodec instances.

#### Parameters

##### value

`unknown`

##### payload

[`ParsePayload`](ParsePayload.md)\<`unknown`\>

#### Returns

[`MaybeAsync`](../../util/type-aliases/MaybeAsync.md)\<[`input`](../type-aliases/input.md)\<`B`\>\>

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`transform`]($ZodPipeDef.md#transform)

***

### type

> **type**: `"pipe"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1002

#### Inherited from

[`$ZodPipeDef`]($ZodPipeDef.md).[`type`]($ZodPipeDef.md#type)
