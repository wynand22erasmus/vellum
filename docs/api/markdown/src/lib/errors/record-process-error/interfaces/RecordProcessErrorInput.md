# Interface: RecordProcessErrorInput

Defined in: [src/lib/errors/record-process-error.ts:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L17)

Payload for `recordProcessError` — same shape across HTTP and workers.

## Properties

### auditLogId?

> `optional` **auditLogId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:37](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L37)

Linked `AuditLog` when correlation is known at record time.

***

### communicationId?

> `optional` **communicationId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:27](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L27)

***

### correlationId?

> `optional` **correlationId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:39](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L39)

Shared incident UUID across audit and process-error pipelines.

***

### deadLetterId?

> `optional` **deadLetterId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:33](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L33)

Linked `DeadLetter` when audit enqueue/worker failed.

***

### detail

> **detail**: `string`

Defined in: [src/lib/errors/record-process-error.ts:21](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L21)

***

### documentId?

> `optional` **documentId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:26](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L26)

***

### extensions?

> `optional` **extensions?**: `Record`\<`string`, `unknown`\>

Defined in: [src/lib/errors/record-process-error.ts:28](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L28)

***

### instance?

> `optional` **instance?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L22)

***

### internal?

> `optional` **internal?**: `Record`\<`string`, `unknown`\>

Defined in: [src/lib/errors/record-process-error.ts:29](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L29)

***

### jobId?

> `optional` **jobId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:30](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L30)

***

### jobName?

> `optional` **jobName?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:31](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L31)

***

### problemType

> **problemType**: `string`

Defined in: [src/lib/errors/record-process-error.ts:18](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L18)

***

### relatedDeadLetterId?

> `optional` **relatedDeadLetterId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:35](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L35)

Alias for [deadLetterId](#deadletterid).

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:23](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L23)

***

### source

> **source**: [`ProcessErrorSource`](../type-aliases/ProcessErrorSource.md)

Defined in: [src/lib/errors/record-process-error.ts:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L24)

***

### status

> **status**: `number`

Defined in: [src/lib/errors/record-process-error.ts:20](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L20)

***

### title

> **title**: `string`

Defined in: [src/lib/errors/record-process-error.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L19)

***

### userId?

> `optional` **userId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:25](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/errors/record-process-error.ts#L25)
