# Interface: ZodJSONSchemaInternals

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:759

## Extends

- `_ZodJSONSchemaInternals`

## Properties

### def

> **def**: [`$ZodUnionDef`](../namespaces/core/interfaces/$ZodUnionDef.md)\<\[[`ZodString`](ZodString-1.md), [`ZodNumber`](ZodNumber-1.md), [`ZodBoolean`](ZodBoolean-1.md), [`ZodNull`](ZodNull.md), [`ZodArray`](ZodArray.md)\<[`ZodJSONSchema`](ZodJSONSchema.md)\>, [`ZodRecord`](ZodRecord.md)\<[`ZodString`](ZodString-1.md), [`ZodJSONSchema`](ZodJSONSchema.md)\>\]\>

Defined in: node\_modules/zod/v4/core/schemas.d.cts:653

Schema definition.

#### Inherited from

`_ZodJSONSchemaInternals.def`

***

### input

> **input**: [`JSONType`](../type-aliases/JSONType.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:761

#### Overrides

`_ZodJSONSchemaInternals.input`

***

### output

> **output**: [`JSONType`](../type-aliases/JSONType.md)

Defined in: node\_modules/zod/v4/classic/schemas.d.cts:760

#### Overrides

`_ZodJSONSchemaInternals.output`

***

### toJSONSchema?

> `optional` **toJSONSchema?**: () => `unknown`

Defined in: node\_modules/zod/v4/core/schemas.d.cts:82

An optional method used to override `toJSONSchema` logic.

#### Returns

`unknown`

#### Inherited from

`_ZodJSONSchemaInternals.toJSONSchema`

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

`_ZodJSONSchemaInternals.version`
