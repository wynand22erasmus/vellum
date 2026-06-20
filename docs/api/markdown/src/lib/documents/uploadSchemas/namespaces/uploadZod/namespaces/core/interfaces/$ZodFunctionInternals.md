# Interface: $ZodFunctionInternals\<Args, Returns\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1112

## Type Parameters

### Args

`Args` *extends* [`$ZodFunctionIn`](../type-aliases/$ZodFunctionIn.md)

### Returns

`Returns` *extends* [`$ZodFunctionOut`](../type-aliases/$ZodFunctionOut.md)

## Properties

### def

> **def**: [`$ZodFunctionDef`]($ZodFunctionDef.md)\<`Args`, `Returns`\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:1113

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
