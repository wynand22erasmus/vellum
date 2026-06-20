# Variable: emailWorker

> `const` **emailWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/emailWorker.ts:26](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/workers/emailWorker.ts#L26)

Processes `email-queue` jobs: loads the document, sends mail, enqueues audit trail.
