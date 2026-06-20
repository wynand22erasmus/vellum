# Interface: $ZodNumberInternals\<Input\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:389

## Extended by

- [`$ZodNumberFormatInternals`]($ZodNumberFormatInternals.md)

## Type Parameters

### Input

`Input` = `unknown`

## Properties

### def

> **def**: [`$ZodNumberDef`]($ZodNumberDef.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:390

Schema definition.

#### Overrides

`$ZodTypeInternals.def`

***

### ~~isst~~

> **isst**: [`$ZodIssueInvalidType`]($ZodIssueInvalidType.md)

Defined in: node\_modules/zod/v4/core/schemas.d.cts:394

#### Deprecated

Internal API, use with caution (not deprecated)

#### Overrides

`$ZodTypeInternals.isst`

***

### ~~pattern~~

> **pattern**: `RegExp`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:392

#### Deprecated

Internal API, use with caution (not deprecated)

#### Overrides

`$ZodTypeInternals.pattern`

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
