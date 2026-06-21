# Variable: auditWorker

> `const` **auditWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/auditWorker.ts:27](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/workers/auditWorker.ts#L27)

Consumes `log-event` jobs and inserts `AuditLog` rows with compliance TTL.
