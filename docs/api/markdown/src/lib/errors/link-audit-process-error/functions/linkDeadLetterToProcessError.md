# Function: linkDeadLetterToProcessError()

> **linkDeadLetterToProcessError**(`deadLetterId`, `processErrorId`): `Promise`\<`void`\>

Defined in: [src/lib/errors/link-audit-process-error.ts:29](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/link-audit-process-error.ts#L29)

Sets dead-letter `linkedTable`/`linkedId` after the process error row is persisted.

## Parameters

### deadLetterId

`string`

### processErrorId

`string`

## Returns

`Promise`\<`void`\>
