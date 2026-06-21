# Interface: ProcessErrorJobData

Defined in: [src/server/queues/processErrorQueue.ts:16](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L16)

Payload for a single process-error persistence job.

## Properties

### auditLogId?

> `optional` **auditLogId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:32](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L32)

Linked `AuditLog` when correlation is known at record time.

***

### communicationId?

> `optional` **communicationId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:26](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L26)

***

### correlationId?

> `optional` **correlationId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:34](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L34)

Shared incident UUID across audit and process-error pipelines.

***

### deadLetterId?

> `optional` **deadLetterId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:30](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L30)

Linked `DeadLetter` when audit enqueue/worker failed.

***

### detail

> **detail**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:20](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L20)

***

### documentId?

> `optional` **documentId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:25](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L25)

***

### extensions?

> `optional` **extensions?**: `Record`\<`string`, `unknown`\>

Defined in: [src/server/queues/processErrorQueue.ts:27](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L27)

***

### instance?

> `optional` **instance?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:21](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L21)

***

### internal?

> `optional` **internal?**: `Record`\<`string`, `unknown`\>

Defined in: [src/server/queues/processErrorQueue.ts:28](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L28)

***

### problemType

> **problemType**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:17](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L17)

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L22)

***

### source

> **source**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:23](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L23)

***

### status

> **status**: `number`

Defined in: [src/server/queues/processErrorQueue.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L19)

***

### title

> **title**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:18](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L18)

***

### userId?

> `optional` **userId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/processErrorQueue.ts#L24)
