# Function: recordProcessErrorFromProblem()

> **recordProcessErrorFromProblem**(`problem`, `ctx`): `void`

Defined in: [src/lib/errors/record-process-error.ts:106](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L106)

Persists a normalized Problem Details envelope.

## Parameters

### problem

[`ProblemDetails`](../../../http/problem-details/interfaces/ProblemDetails.md)

### ctx

#### auditLogId?

`string`

#### communicationId?

`string`

#### correlationId?

`string`

#### deadLetterId?

`string`

#### documentId?

`string`

#### instance?

`string`

#### internal?

`Record`\<`string`, `unknown`\>

#### jobId?

`string`

#### jobName?

`string`

#### requestId?

`string`

#### source

[`ProcessErrorSource`](../type-aliases/ProcessErrorSource.md)

#### userId?

`string`

## Returns

`void`
