# Function: \_default()

> **\_default**\<`T`\>(`Class`, `innerType`, `defaultValue`): [`$ZodDefault`](../interfaces/$ZodDefault.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/api.d.cts:272

## Type Parameters

### T

`T` *extends* [`$ZodObject`](../interfaces/$ZodObject.md)\<`Readonly`\<`Readonly`\<\{\[`k`: `string`\]: [`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>; \}\>\>, [`$ZodObjectConfig`](../type-aliases/$ZodObjectConfig.md)\>

## Parameters

### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodDefault`](../interfaces/$ZodDefault.md)\<[`$ZodType`](../interfaces/$ZodType-1.md)\<`unknown`, `unknown`, `$ZodTypeInternals`\<`unknown`, `unknown`\>\>\>\>

### innerType

`T`

### defaultValue

[`NoUndefined`](../../util/type-aliases/NoUndefined.md)\<[`output`](../type-aliases/output.md)\<`T`\>\> \| (() => [`NoUndefined`](../../util/type-aliases/NoUndefined.md)\<[`output`](../type-aliases/output.md)\<`T`\>\>)

## Returns

[`$ZodDefault`](../interfaces/$ZodDefault.md)\<`T`\>
