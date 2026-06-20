# Function: createPgStudioExecutor()

> **createPgStudioExecutor**(`db?`): `object`

Defined in: [src/lib/studio-pg-executor.ts:34](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/studio-pg-executor.ts#L34)

Executor compatible with `@prisma/studio-core` BFF responses.

## Parameters

### db?

`Pool` = `...`

## Returns

`object`

### execute()

> **execute**(`query`, `options?`): `Promise`\<\[`Error`\] \| \[`null`, `Record`\<`string`, `unknown`\>[]\]\>

#### Parameters

##### query

###### parameters

readonly `unknown`[]

###### sql

`string`

##### options?

###### abortSignal?

`AbortSignal`

#### Returns

`Promise`\<\[`Error`\] \| \[`null`, `Record`\<`string`, `unknown`\>[]\]\>
