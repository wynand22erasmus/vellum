# Function: createDeadLetter()

> **createDeadLetter**(`input`): `Promise`\<\{ `createdAt`: `Date`; `deadLetterId`: `string`; `error`: `string`; `linkedId`: `string` \| `null`; `linkedTable`: `string` \| `null`; `payload`: `JsonValue`; `pipeline`: `DeadLetterPipeline`; `retried`: `boolean`; \}\>

Defined in: src/lib/dead-letter.ts:19

Persists a dead-letter row when a queue job cannot be processed.

## Parameters

### input

[`CreateDeadLetterInput`](../type-aliases/CreateDeadLetterInput.md)

## Returns

`Promise`\<\{ `createdAt`: `Date`; `deadLetterId`: `string`; `error`: `string`; `linkedId`: `string` \| `null`; `linkedTable`: `string` \| `null`; `payload`: `JsonValue`; `pipeline`: `DeadLetterPipeline`; `retried`: `boolean`; \}\>
