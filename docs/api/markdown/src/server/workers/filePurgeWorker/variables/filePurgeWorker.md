# Variable: filePurgeWorker

> `const` **filePurgeWorker**: `Worker`\<`any`, `any`, `string`\>

Defined in: src/server/workers/filePurgeWorker.ts:24

Handles `cleanup-queue` jobs named `purge-files`.

## Remarks

DB update before S3 delete; per-file compensation on failure.
