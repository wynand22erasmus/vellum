# Type Alias: $InferOuterFunctionTypeAsync\<Args, Returns\>

> **$InferOuterFunctionTypeAsync**\<`Args`, `Returns`\> = (...`args`) => `Promise`\<[`output`](output.md)\<`Returns`\>\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1106

## Type Parameters

### Args

`Args` *extends* [`$ZodFunctionIn`]($ZodFunctionIn.md)

### Returns

`Returns` *extends* [`$ZodFunctionOut`]($ZodFunctionOut.md)

## Parameters

### args

...[`$ZodFunctionIn`]($ZodFunctionIn.md) *extends* `Args` ? `never`[] : [`input`](input.md)\<`Args`\>

## Returns

`Promise`\<[`output`](output.md)\<`Returns`\>\>
