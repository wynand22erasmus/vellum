# Function: \_pipe()

> **\_pipe**\<`A`, `B`\>(`Class`, `in_`, `out`): [`$ZodPipe`](../interfaces/$ZodPipe.md)\<`A`, `B`\>

Defined in: node\_modules/zod/v4/core/api.d.cts:280

## Type Parameters

### A

`A` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>

### B

`B` *extends* [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, [`output`](../type-aliases/output.md)\<`A`\>, `$ZodTypeInternals`\<`unknown`, [`output`](../type-aliases/output.md)\<`A`\>\>\> = [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, [`output`](../type-aliases/output.md)\<`A`\>, `$ZodTypeInternals`\<`unknown`, [`output`](../type-aliases/output.md)\<`A`\>\>\>

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodPipe`](../interfaces/$ZodPipe.md)\<[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>, [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>\>

### in\_

`A`

### out

`B` \| [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, [`output`](../type-aliases/output.md)\<`A`\>, `$ZodTypeInternals`\<`unknown`, [`output`](../type-aliases/output.md)\<`A`\>\>\>

## Returns

[`$ZodPipe`](../interfaces/$ZodPipe.md)\<`A`, `B`\>
