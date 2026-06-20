# Interface: RecordProcessErrorInput

Defined in: [src/lib/errors/record-process-error.ts:16](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L16)

Payload for `recordProcessError` — same shape across HTTP and workers.

## Properties

### auditLogId?

> `optional` **auditLogId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:35](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L35)

Linked `AuditLog` when correlation is known at record time.

***

### correlationId?

> `optional` **correlationId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:37](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L37)

Shared incident UUID across audit and process-error pipelines.

***

### detail

> **detail**: `string`

Defined in: [src/lib/errors/record-process-error.ts:20](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L20)

***

### documentId?

> `optional` **documentId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:25](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L25)

***

### extensions?

> `optional` **extensions?**: `Record`\<`string`, `unknown`\>

Defined in: [src/lib/errors/record-process-error.ts:26](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L26)

***

### failedAuditLogId?

> `optional` **failedAuditLogId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:31](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L31)

Linked `FailedAuditLog` when audit enqueue/worker failed.

***

### instance?

> `optional` **instance?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:21](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L21)

***

### internal?

> `optional` **internal?**: `Record`\<`string`, `unknown`\>

Defined in: [src/lib/errors/record-process-error.ts:27](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L27)

***

### jobId?

> `optional` **jobId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:28](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L28)

***

### jobName?

> `optional` **jobName?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:29](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L29)

***

### problemType

> **problemType**: `string`

Defined in: [src/lib/errors/record-process-error.ts:17](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L17)

***

### relatedFailedAuditLogId?

> `optional` **relatedFailedAuditLogId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:33](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L33)

Alias for [failedAuditLogId](#failedauditlogid).

***

### requestId?

> `optional` **requestId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:22](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L22)

***

### source

> **source**: [`ProcessErrorSource`](../type-aliases/ProcessErrorSource.md)

Defined in: [src/lib/errors/record-process-error.ts:23](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L23)

***

### status

> **status**: `number`

Defined in: [src/lib/errors/record-process-error.ts:19](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L19)

***

### title

> **title**: `string`

Defined in: [src/lib/errors/record-process-error.ts:18](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L18)

***

### userId?

> `optional` **userId?**: `string`

Defined in: [src/lib/errors/record-process-error.ts:24](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/errors/record-process-error.ts#L24)
