# Interface: $ZodFunction\<Args, Returns\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1116

## Extends

- [`$ZodType`]($ZodType-1.md)\<`any`, `any`, [`$ZodFunctionInternals`]($ZodFunctionInternals.md)\<`Args`, `Returns`\>\>

## Extended by

- [`ZodFunction`](../../../interfaces/ZodFunction.md)

## Type Parameters

### Args

`Args` *extends* [`$ZodFunctionIn`](../type-aliases/$ZodFunctionIn.md) = [`$ZodFunctionIn`](../type-aliases/$ZodFunctionIn.md)

### Returns

`Returns` *extends* [`$ZodFunctionOut`](../type-aliases/$ZodFunctionOut.md) = [`$ZodFunctionOut`](../type-aliases/$ZodFunctionOut.md)

## Properties

### ~~\_def~~

> **\_def**: [`$ZodFunctionDef`]($ZodFunctionDef.md)\<`Args`, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1118

#### Deprecated

***

### \_input

> **\_input**: [`$InferInnerFunctionType`](../type-aliases/$InferInnerFunctionType.md)\<`Args`, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1119

***

### \_output

> **\_output**: [`$InferOuterFunctionType`](../type-aliases/$InferOuterFunctionType.md)\<`Args`, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1120

***

### \_zod

> **\_zod**: [`$ZodFunctionInternals`]($ZodFunctionInternals.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:98

#### Inherited from

[`$ZodType`]($ZodType-1.md).[`_zod`]($ZodType-1.md#_zod)

***

### ~standard

> **~standard**: [`$ZodStandardSchema`](../type-aliases/$ZodStandardSchema.md)\<`$ZodFunction`\<`Args`, `Returns`\>\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:99

#### Inherited from

[`$ZodType`]($ZodType-1.md).[`~standard`]($ZodType-1.md#standard)

## Methods

### implement()

> **implement**\<`F`\>(`func`): (...`args`) => `ReturnType`\<`F`\> *extends* [`output`](../type-aliases/output.md)\<`Returns`\> ? [`output`](../type-aliases/output.md)\<`Returns`\> & `ReturnType`\<`F`\> : [`output`](../type-aliases/output.md)\<`Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1121

#### Type Parameters

##### F

`F` *extends* [`$InferInnerFunctionType`](../type-aliases/$InferInnerFunctionType.md)\<`Args`, `Returns`\>

#### Parameters

##### func

`F`

#### Returns

(...`args`) => `ReturnType`\<`F`\> *extends* [`output`](../type-aliases/output.md)\<`Returns`\> ? [`output`](../type-aliases/output.md)\<`Returns`\> & `ReturnType`\<`F`\> : [`output`](../type-aliases/output.md)\<`Returns`\>

***

### implementAsync()

> **implementAsync**\<`F`\>(`func`): `F` *extends* [`$InferOuterFunctionTypeAsync`](../type-aliases/$InferOuterFunctionTypeAsync.md)\<`Args`, `Returns`\> ? `F` : [`$InferOuterFunctionTypeAsync`](../type-aliases/$InferOuterFunctionTypeAsync.md)\<`Args`, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1122

#### Type Parameters

##### F

`F` *extends* [`$InferInnerFunctionTypeAsync`](../type-aliases/$InferInnerFunctionTypeAsync.md)\<`Args`, `Returns`\>

#### Parameters

##### func

`F`

#### Returns

`F` *extends* [`$InferOuterFunctionTypeAsync`](../type-aliases/$InferOuterFunctionTypeAsync.md)\<`Args`, `Returns`\> ? `F` : [`$InferOuterFunctionTypeAsync`](../type-aliases/$InferOuterFunctionTypeAsync.md)\<`Args`, `Returns`\>

***

### input()

#### Call Signature

> **input**\<`Items`, `Rest`\>(`args`, `rest?`): `$ZodFunction`\<[`$ZodTuple`]($ZodTuple.md)\<`Items`, `Rest`\>, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1123

##### Type Parameters

###### Items

`Items` *extends* [`TupleItems`](../../util/type-aliases/TupleItems.md)

###### Rest

`Rest` *extends* [`$ZodFunctionOut`](../type-aliases/$ZodFunctionOut.md) = [`$ZodFunctionOut`](../type-aliases/$ZodFunctionOut.md)

##### Parameters

###### args

`Items`

###### rest?

`Rest`

##### Returns

`$ZodFunction`\<[`$ZodTuple`]($ZodTuple.md)\<`Items`, `Rest`\>, `Returns`\>

#### Call Signature

> **input**\<`NewArgs`\>(`args`): `$ZodFunction`\<`NewArgs`, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1124

##### Type Parameters

###### NewArgs

`NewArgs` *extends* [`$ZodFunctionArgs`](../type-aliases/$ZodFunctionArgs.md)

##### Parameters

###### args

`NewArgs`

##### Returns

`$ZodFunction`\<`NewArgs`, `Returns`\>

#### Call Signature

> **input**(...`args`): `$ZodFunction`\<`any`, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1125

##### Parameters

###### args

...`any`[]

##### Returns

`$ZodFunction`\<`any`, `Returns`\>

***

### output()

> **output**\<`NewReturns`\>(`output`): `$ZodFunction`\<`Args`, `NewReturns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1126

#### Type Parameters

##### NewReturns

`NewReturns` *extends* [`$ZodType`]($ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

#### Parameters

##### output

`NewReturns`

#### Returns

`$ZodFunction`\<`Args`, `NewReturns`\>
