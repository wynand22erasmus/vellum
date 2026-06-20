# Function: sendProblem()

> **sendProblem**(`res`, `problem`): `void`

Defined in: [src/lib/errors/send-problem.ts:17](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/send-problem.ts#L17)

Writes an `application/problem+json` response.

## Parameters

### res

`Response`

Express response

### problem

[`ProblemDetails`](../../../http/problem-details/interfaces/ProblemDetails.md)

RFC 9457 body

## Returns

`void`
