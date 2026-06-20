# Type Alias: $InferZodRecordOutput\<Key, Value\>

> **$InferZodRecordOutput**\<`Key`, `Value`\> = `Key` *extends* [`$partial`]($partial.md) ? `Partial`\<`Record`\<[`output`](output.md)\<`Key`\>, [`output`](output.md)\<`Value`\>\>\> : `Record`\<[`output`](output.md)\<`Key`\>, [`output`](output.md)\<`Value`\>\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:746

## Type Parameters

### Key

`Key` *extends* [`$ZodRecordKey`]($ZodRecordKey.md) = [`$ZodRecordKey`]($ZodRecordKey.md)

### Value

`Value` *extends* [`SomeType`](SomeType.md) = [`$ZodType`](../interfaces/$ZodType-1.md)
