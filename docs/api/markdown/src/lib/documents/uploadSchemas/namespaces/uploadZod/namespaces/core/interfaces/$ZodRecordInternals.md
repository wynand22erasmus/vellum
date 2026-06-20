# Interface: $ZodRecordInternals\<Key, Value\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:748

## Type Parameters

### Key

`Key` *extends* [`$ZodRecordKey`](../type-aliases/$ZodRecordKey.md) = [`$ZodRecordKey`](../type-aliases/$ZodRecordKey.md)

### Value

`Value` *extends* [`SomeType`](../type-aliases/SomeType.md) = [`$ZodType`]($ZodType-1.md)

## Properties

### def

> **def**: [`$ZodRecordDef`]($ZodRecordDef.md)\<`Key`, `Value`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:749

Schema definition.

#### Overrides

`$ZodTypeInternals.def`

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

`$ZodTypeInternals.toJSONSchema`

***

### version

> **version**: `object`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:42

The `@zod/core` version of this schema

#### major

> `readonly` **major**: `4`

#### minor

> `readonly` **minor**: `4`

#### patch

> `readonly` **patch**: `number`

#### Inherited from

`$ZodTypeInternals.version`
