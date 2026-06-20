# Function: \_intersection()

> **\_intersection**\<`T`, `U`\>(`Class`, `left`, `right`): [`$ZodIntersection`](../interfaces/$ZodIntersection.md)\<`T`, `U`\>

Defined in: node\_modules/zod/v4/core/api.d.cts:239

## Type Parameters

### T

`T` *extends* [`$ZodObject`](../interfaces/$ZodObject.md)\<`Readonly`\<`Readonly`\<\{\[`k`: `string`\]: [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\>\>, [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md)\>

### U

`U` *extends* [`$ZodObject`](../interfaces/$ZodObject.md)\<`Readonly`\<`Readonly`\<\{\[`k`: `string`\]: [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\>\>, [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md)\>

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodIntersection`](../interfaces/$ZodIntersection.md)\<[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>, [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>\>

### left

`T`

### right

`U`

## Returns

[`$ZodIntersection`](../interfaces/$ZodIntersection.md)\<`T`, `U`\>
