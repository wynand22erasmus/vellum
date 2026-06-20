# Interface: $ZodRecordDef\<Key, Value\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:739

## Extends

- [`$ZodTypeDef`]($ZodTypeDef.md)

## Type Parameters

### Key

`Key` *extends* [`$ZodRecordKey`](../type-aliases/$ZodRecordKey.md) = [`$ZodRecordKey`](../type-aliases/$ZodRecordKey.md)

### Value

`Value` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### checks?

> `optional` **checks?**: [`$ZodCheck`]($ZodCheck.md)\<`never`\>[]

Defined in: node\_modules/zod/v4/core/schemas.d.cts:38

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`checks`]($ZodTypeDef.md#checks)

***

### error?

> `optional` **error?**: [`$ZodErrorMap`]($ZodErrorMap.md)\<`never`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:37

#### Inherited from

[`$ZodTypeDef`]($ZodTypeDef.md).[`error`]($ZodTypeDef.md#error)

***

### keyType

> **keyType**: `Key`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:741

***

### mode?

> `optional` **mode?**: `"strict"` \| `"loose"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:744

#### Default

```ts
"strict" - errors on keys not matching keyType. "loose" passes through non-matching keys unchanged.
```

***

### type

> **type**: `"record"`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:740

#### Overrides

[`$ZodTypeDef`]($ZodTypeDef.md).[`type`]($ZodTypeDef.md#type)

***

### valueType

> **valueType**: `Value`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:742
