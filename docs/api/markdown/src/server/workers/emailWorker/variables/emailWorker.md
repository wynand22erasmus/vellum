# Variable: emailWorker

> `const` **emailWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: [src/server/workers/emailWorker.ts:26](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/workers/emailWorker.ts#L26)

Processes `email-queue` jobs: loads the document link, sends mail, enqueues audit trail.
