# Interface: LogEventData

Defined in: [src/server/queues/auditQueue.ts:19](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L19)

Payload for a single audit event job (`log-event`).

## Properties

### communicationId?

> `optional` **communicationId?**: `string`

Defined in: [src/server/queues/auditQueue.ts:24](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L24)

Specific outbound communication id for link-level events.

***

### correlationId?

> `optional` **correlationId?**: `string`

Defined in: [src/server/queues/auditQueue.ts:29](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L29)

***

### documentId?

> `optional` **documentId?**: `string`

Defined in: [src/server/queues/auditQueue.ts:22](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L22)

Envelope id for document-level events (e.g. LINK_REVOKED).

***

### eventType

> **eventType**: `AuditEventType`

Defined in: [src/server/queues/auditQueue.ts:20](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L20)

***

### ip?

> `optional` **ip?**: `string`

Defined in: [src/server/queues/auditQueue.ts:27](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L27)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `unknown`\>

Defined in: [src/server/queues/auditQueue.ts:26](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L26)

***

### userAgent?

> `optional` **userAgent?**: `string`

Defined in: [src/server/queues/auditQueue.ts:28](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L28)

***

### userId?

> `optional` **userId?**: `string`

Defined in: [src/server/queues/auditQueue.ts:25](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/auditQueue.ts#L25)
