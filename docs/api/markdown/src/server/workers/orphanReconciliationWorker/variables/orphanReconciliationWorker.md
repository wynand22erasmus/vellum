# Variable: orphanReconciliationWorker

> `const` **orphanReconciliationWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/orphanReconciliationWorker.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/workers/orphanReconciliationWorker.ts#L14)

BullMQ worker that reconciles orphaned resources from `ProcessError` rows.
