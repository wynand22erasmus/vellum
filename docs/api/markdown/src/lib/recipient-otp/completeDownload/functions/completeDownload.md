# Function: completeDownload()

> **completeDownload**(`doc`, `req`, `now?`, `consumptionConfig?`): `Promise`\<[`CompleteDownloadResult`](../type-aliases/CompleteDownloadResult.md)\>

Defined in: src/lib/recipient-otp/completeDownload.ts:29

Issues presigned URL, updates download consumption counters, and logs success audit.

## Parameters

### doc

[`DocumentContext`](../../../documents/types/type-aliases/DocumentContext.md)

### req

`Pick`\<`Request`, `"ip"` \| `"headers"`\>

### now?

`Date` = `...`

### consumptionConfig?

[`VerifyConsumptionConfig`](../../../verify-consumption/type-aliases/VerifyConsumptionConfig.md) = `...`

## Returns

`Promise`\<[`CompleteDownloadResult`](../type-aliases/CompleteDownloadResult.md)\>
