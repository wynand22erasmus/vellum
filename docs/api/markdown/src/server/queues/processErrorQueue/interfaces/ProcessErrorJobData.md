# Interface: ProcessErrorJobData

Defined in: [src/server/queues/processErrorQueue.ts:16](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L16)

Payload for a single process-error persistence job.

## Properties

### auditLogId?

> `optional` **auditLogId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:31](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L31)

Linked `AuditLog` when correlation is known at record time.

***

### correlationId?

> `optional` **correlationId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:33](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L33)

Shared incident UUID across audit and process-error pipelines.

***

### detail

> **detail**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:20](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L20)

***

### documentId?

> `optional` **documentId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:25](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L25)

***

### extensions?

> `optional` **extensions?**: `Record`\<`string`, `unknown`\>

Defined in: [src/server/queues/processErrorQueue.ts:26](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L26)

***

### failedAuditLogId?

> `optional` **failedAuditLogId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:29](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L29)

Linked `FailedAuditLog` when audit enqueue/worker failed.

***

### instance?

> `optional` **instance?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:21](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L21)

***

### internal?

> `optional` **internal?**: `Record`\<`string`, `unknown`\>

Defined in: [src/server/queues/processErrorQueue.ts:27](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L27)

***

### problemType

> **problemType**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:17](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L17)

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:22](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L22)

***

### source

> **source**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:23](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L23)

***

### status

> **status**: `number`

Defined in: [src/server/queues/processErrorQueue.ts:19](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L19)

***

### title

> **title**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:18](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L18)

***

### userId?

> `optional` **userId?**: `string`

Defined in: [src/server/queues/processErrorQueue.ts:24](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/processErrorQueue.ts#L24)
