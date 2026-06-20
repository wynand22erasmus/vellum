# Function: pipe()

> **pipe**\<`A`, `B`\>(`in_`, `out`): [`ZodPipe`](../interfaces/ZodPipe.md)\<`A`, `B`\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:665

## Type Parameters

### A

`A` *extends* [`SomeType`](../namespaces/core/type-aliases/SomeType.md)

### B

`B` *extends* [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, [`output`](../namespaces/core/type-aliases/output.md)\<`A`\>, `$ZodTypeInternals`\<`unknown`, [`output`](../namespaces/core/type-aliases/output.md)\<`A`\>\>\> = [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, [`output`](../namespaces/core/type-aliases/output.md)\<`A`\>, `$ZodTypeInternals`\<`unknown`, [`output`](../namespaces/core/type-aliases/output.md)\<`A`\>\>\>

## Parameters

### in\_

`A`

### out

`B` \| [`$ZodType`](../namespaces/core/interfaces/$ZodType-1.md)\<`unknown`, [`output`](../namespaces/core/type-aliases/output.md)\<`A`\>, `$ZodTypeInternals`\<`unknown`, [`output`](../namespaces/core/type-aliases/output.md)\<`A`\>\>\>

## Returns

[`ZodPipe`](../interfaces/ZodPipe.md)\<`A`, `B`\>
