# Function: sendProblem()

> **sendProblem**(`res`, `problem`): `void`

Defined in: [src/lib/errors/send-problem.ts:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/send-problem.ts#L17)

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
