# Function: problemFromError()

> **problemFromError**(`err`, `ctx?`): `object`

Defined in: [src/lib/errors/problem-from-error.ts:31](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/problem-from-error.ts#L31)

Converts any thrown value into a Problem Details object and optional internal metadata.

## Parameters

### err

`unknown`

Caught error

### ctx?

[`ProblemFromErrorContext`](../interfaces/ProblemFromErrorContext.md) = `{}`

Request context for `instance` / logging

## Returns

`object`

### internal

> **internal**: `Record`\<`string`, `unknown`\>

### problem

> **problem**: [`ProblemDetails`](../../../http/problem-details/interfaces/ProblemDetails.md)
