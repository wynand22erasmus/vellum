# Function: createPgStudioExecutor()

> **createPgStudioExecutor**(`db?`): `object`

Defined in: [src/lib/studio-pg-executor.ts:34](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/studio-pg-executor.ts#L34)

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
