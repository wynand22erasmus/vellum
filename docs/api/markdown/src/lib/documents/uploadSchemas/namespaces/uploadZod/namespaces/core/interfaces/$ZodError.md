# Interface: $ZodError\<T\>

Defined in: node\_modules/zod/v4/core/errors.d.cts:132

## Extends

- `Error`

## Extended by

- [`ZodError`](../../../interfaces/ZodError.md)

## Type Parameters

### T

`T` = `unknown`

## Properties

### \_zod

> **\_zod**: `object`

Defined in: node\_modules/zod/v4/core/errors.d.cts:135

#### def

> **def**: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]

#### output

> **output**: `T`

***

### cause?

> `optional` **cause?**: `unknown`

Defined in: node\_modules/typescript/lib/lib.es2022.error.d.ts:24

#### Inherited from

`Error.cause`

***

### issues

> **issues**: [`$ZodIssue`](../type-aliases/$ZodIssue.md)[]

Defined in: node\_modules/zod/v4/core/errors.d.cts:134

***

### message

> **message**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/zod/v4/core/errors.d.cts:140

#### Overrides

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/zod/v4/core/errors.d.cts:139

#### Overrides

`Error.stack`

***

### type

> **type**: `T`

Defined in: node\_modules/zod/v4/core/errors.d.cts:133
