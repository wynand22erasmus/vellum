# Function: httpUrl()

> **httpUrl**(`params?`): [`ZodURL`](../interfaces/ZodURL.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:198

## Parameters

### params?

`string` \| `Omit`\<\{ `abort?`: `boolean`; `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<`NonNullable`\<[`$ZodIssueInvalidStringFormat`](../namespaces/core/interfaces/$ZodIssueInvalidStringFormat.md) \| [`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>\>; `hostname?`: `RegExp`; `message?`: `string`; `normalize?`: `boolean`; `pattern?`: `RegExp`; `protocol?`: `RegExp`; \}, `"protocol"` \| `"hostname"`\>

## Returns

[`ZodURL`](../interfaces/ZodURL.md)
