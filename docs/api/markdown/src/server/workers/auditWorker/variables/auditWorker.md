# Variable: auditWorker

> `const` **auditWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/auditWorker.ts:25](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/workers/auditWorker.ts#L25)

Consumes `log-event` jobs and inserts `AuditLog` rows with compliance TTL.
