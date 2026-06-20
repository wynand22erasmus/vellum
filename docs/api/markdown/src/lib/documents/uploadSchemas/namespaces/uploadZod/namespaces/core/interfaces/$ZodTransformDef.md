# Interface: $ZodTransformDef

Defined in: node\_modules/zod/v4/core/schemas.d.cts:848

## Extends

- [`$ZodTypeDef`]($ZodTypeDef.md)

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

### transform

> **transform**: (`input`, `payload`) => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:850

#### Parameters

##### input

`unknown`

##### payload

[`ParsePayload`](ParsePayload.md)\<`unknown`\>

#### Returns

`unknown`

***

### type

> **type**: `"transform"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:849

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)
