# Function: \_literal()

## Call Signature

> **\_literal**\<`T`\>(`Class`, `value`, `params?`): [`$ZodLiteral`](../interfaces/$ZodLiteral.md)\<`T`\[`number`\]\>

Defined in: node\_modules/zod/v4/core/api.d.cts:261

### Type Parameters

#### T

`T` *extends* [`Literal`](../../util/type-aliases/Literal.md)[]

### Parameters

#### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodLiteral`](../interfaces/$ZodLiteral.md)\<[`Literal`](../../util/type-aliases/Literal.md)\>\>

#### value

`T`

#### params?

`string` \| \{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

`string`

***

##### Type Literal

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

###### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`$ZodLiteral`](../interfaces/$ZodLiteral.md)\<`T`\[`number`\]\>

## Call Signature

> **\_literal**\<`T`\>(`Class`, `value`, `params?`): [`$ZodLiteral`](../interfaces/$ZodLiteral.md)\<`T`\>

Defined in: node\_modules/zod/v4/core/api.d.cts:262

### Type Parameters

#### T

`T` *extends* [`Literal`](../../util/type-aliases/Literal.md)

### Parameters

#### Class

[`SchemaClass`](../../util/type-aliases/SchemaClass.md)\<[`$ZodLiteral`](../interfaces/$ZodLiteral.md)\<[`Literal`](../../util/type-aliases/Literal.md)\>\>

#### value

`T`

#### params?

`string` \| \{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

`string`

***

##### Type Literal

\{ `error?`: `string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>; `message?`: `string`; \}

###### error?

`string` \| [`$ZodErrorMap`](../interfaces/$ZodErrorMap.md)\<[`$ZodIssueInvalidValue`](../interfaces/$ZodIssueInvalidValue.md)\<`unknown`\>\>

###### message?

`string`

**Deprecated**

This parameter is deprecated. Use `error` instead.

### Returns

[`$ZodLiteral`](../interfaces/$ZodLiteral.md)\<`T`\>
