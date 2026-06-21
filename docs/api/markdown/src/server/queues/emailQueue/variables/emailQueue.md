# Variable: emailQueue

> `const` **emailQueue**: `Queue`\<`any`, `any`, `string`, `any`, `any`, `string`\>

Defined in: [src/server/queues/emailQueue.ts:14](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/queues/emailQueue.ts#L14)

BullMQ queue name: `email-queue`.
Jobs: `send-initial` / regenerate payloads processed by `emailWorker`.
