# Variable: orphanReconciliationWorker

> `const` **orphanReconciliationWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/orphanReconciliationWorker.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/workers/orphanReconciliationWorker.ts#L14)

BullMQ worker that reconciles orphaned resources from `ProcessError` rows.
