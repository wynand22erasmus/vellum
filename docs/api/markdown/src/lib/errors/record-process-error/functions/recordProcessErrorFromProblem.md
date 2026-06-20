# Function: recordProcessErrorFromProblem()

> **recordProcessErrorFromProblem**(`problem`, `ctx`): `void`

Defined in: [src/lib/errors/record-process-error.ts:104](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L104)

Persists a normalized Problem Details envelope.

## Parameters

### problem

[`ProblemDetails`](../../../http/problem-details/interfaces/ProblemDetails.md)

### ctx

#### auditLogId?

`string`

#### correlationId?

`string`

#### documentId?

`string`

#### failedAuditLogId?

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
