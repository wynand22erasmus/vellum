# Function: \_function()

## Call Signature

> **\_function**(): [`ZodFunction`](../interfaces/ZodFunction.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:717

### Returns

[`ZodFunction`](../interfaces/ZodFunction.md)

## Call Signature

> **\_function**\<`In`\>(`params`): [`ZodFunction`](../interfaces/ZodFunction.md)\<[`ZodTuple`](../interfaces/ZodTuple.md)\<`In`, `null`\>, [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md)\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:718

### Type Parameters

#### In

`In` *extends* readonly [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>[]

### Parameters

#### params

##### input

`In`

### Returns

[`ZodFunction`](../interfaces/ZodFunction.md)\<[`ZodTuple`](../interfaces/ZodTuple.md)\<`In`, `null`\>, [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md)\>

## Call Signature

> **\_function**\<`In`, `Out`\>(`params`): [`ZodFunction`](../interfaces/ZodFunction.md)\<[`ZodTuple`](../interfaces/ZodTuple.md)\<`In`, `null`\>, `Out`\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:721

### Type Parameters

#### In

`In` *extends* readonly [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>[]

#### Out

`Out` *extends* [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md) = [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md)

### Parameters

#### params

##### input

`In`

##### output

`Out`

### Returns

[`ZodFunction`](../interfaces/ZodFunction.md)\<[`ZodTuple`](../interfaces/ZodTuple.md)\<`In`, `null`\>, `Out`\>

## Call Signature

> **\_function**\<`In`\>(`params`): [`ZodFunction`](../interfaces/ZodFunction.md)\<`In`, [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md)\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:725

### Type Parameters

#### In

`In` *extends* [`$ZodFunctionArgs`](../namespaces/core/type-aliases/$ZodFunctionArgs.md) = [`$ZodFunctionArgs`](../namespaces/core/type-aliases/$ZodFunctionArgs.md)

### Parameters

#### params

##### input

`In`

### Returns

[`ZodFunction`](../interfaces/ZodFunction.md)\<`In`, [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md)\>

## Call Signature

> **\_function**\<`Out`\>(`params`): [`ZodFunction`](../interfaces/ZodFunction.md)\<[`$ZodFunctionArgs`](../namespaces/core/type-aliases/$ZodFunctionArgs.md), `Out`\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:728

### Type Parameters

#### Out

`Out` *extends* [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md) = [`$ZodFunctionOut`](../namespaces/core/type-aliases/$ZodFunctionOut.md)

### Parameters

#### params

##### output

`Out`

### Returns

[`ZodFunction`](../interfaces/ZodFunction.md)\<[`$ZodFunctionArgs`](../namespaces/core/type-aliases/$ZodFunctionArgs.md), `Out`\>

## Call Signature

> **\_function**\<`In`, `Out`\>(`params?`): [`ZodFunction`](../interfaces/ZodFunction.md)\<`In`, `Out`\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:731

### Type Parameters

#### In

`In` *extends* [`$ZodFunctionArgs`](../namespaces/core/type-aliases/$ZodFunctionArgs.md) = [`$ZodFunctionArgs`](../namespaces/core/type-aliases/$ZodFunctionArgs.md)

#### Out

`Out` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\> = [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

### Parameters

#### params?

##### input

`In`

##### output

`Out`

### Returns

[`ZodFunction`](../interfaces/ZodFunction.md)\<`In`, `Out`\>
