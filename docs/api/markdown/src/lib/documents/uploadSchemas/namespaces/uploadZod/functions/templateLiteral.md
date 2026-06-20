# Function: templateLiteral()

> **templateLiteral**\<`Parts`\>(`parts`, `params?`): [`ZodTemplateLiteral`](../interfaces/ZodTemplateLiteral.md)\<[`$PartsToTemplateLiteral`](../namespaces/core/type-aliases/$PartsToTemplateLiteral.md)\<`Parts`\>\>

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:693

## Type Parameters

### Parts

`Parts` *extends* [`$ZodTemplateLiteralPart`](../namespaces/core/type-aliases/$ZodTemplateLiteralPart.md)[]

## Parameters

### parts

`Parts`

### params?

`string` \| \{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `format?`: `string`; `message?`: `string`; \}

`string`

***

#### Type Literal

\{ `error?`: `string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>; `format?`: `string`; `message?`: `string`; \}

##### error?

`string` \| [`$ZodErrorMap`](../namespaces/core/interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidType`](../namespaces/core/interfaces/$ZodIssueInvalidType.md)\<`unknown`\>\>

##### format?

`string`

##### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

## Returns

[`ZodTemplateLiteral`](../interfaces/ZodTemplateLiteral.md)\<[`$PartsToTemplateLiteral`](../namespaces/core/type-aliases/$PartsToTemplateLiteral.md)\<`Parts`\>\>
