# Variable: emailQueue

> `const` **emailQueue**: `Queue`\<`any`, `any`, `string`, `any`, `any`, `string`\>

Defined in: [src/server/queues/emailQueue.ts:14](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/server/queues/emailQueue.ts#L14)

BullMQ queue name: `email-queue`.
Jobs: `send-initial` / regenerate payloads processed by `emailWorker`.
