# Interface: LogEventData

Defined in: [src/server/queues/auditQueue.ts:18](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L18)

Payload for a single audit event job (`log-event`).

## Properties

### correlationId?

> `optional` **correlationId?**: `string`

Defined in: [src/server/queues/auditQueue.ts:26](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L26)

Shared incident UUID for linking to `ProcessError` rows.

***

### documentId?

> `optional` **documentId?**: `string`

Defined in: [src/server/queues/auditQueue.ts:20](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L20)

***

### eventType

> **eventType**: `AuditEventType`

Defined in: [src/server/queues/auditQueue.ts:19](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L19)

***

### ip?

> `optional` **ip?**: `string`

Defined in: [src/server/queues/auditQueue.ts:23](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L23)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\>

Defined in: [src/server/queues/auditQueue.ts:22](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L22)

***

### userAgent?

> `optional` **userAgent?**: `string`

Defined in: [src/server/queues/auditQueue.ts:24](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L24)

***

### userId?

> `optional` **userId?**: `string`

Defined in: [src/server/queues/auditQueue.ts:21](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/auditQueue.ts#L21)
