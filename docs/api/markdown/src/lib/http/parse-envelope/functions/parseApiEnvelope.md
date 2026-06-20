# Function: parseApiEnvelope()

> **parseApiEnvelope**\<`T`\>(`res`): `Promise`\<[`ParsedApiResponse`](../type-aliases/ParsedApiResponse.md)\<`T`\>\>

Defined in: [src/lib/http/parse-envelope.ts:69](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/http/parse-envelope.ts#L69)

Parses JSON body, Content-Type, and status into a typed envelope.

## Type Parameters

### T

`T`

## Parameters

### res

`Response`

Fetch Response (body consumed once)

## Returns

`Promise`\<[`ParsedApiResponse`](../type-aliases/ParsedApiResponse.md)\<`T`\>\>
