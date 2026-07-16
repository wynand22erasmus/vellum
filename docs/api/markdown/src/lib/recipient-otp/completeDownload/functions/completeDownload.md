# Function: completeDownload()

> **completeDownload**(`doc`, `req`, `now?`, `consumptionConfig?`): `Promise`\<[`CompleteDownloadResult`](../type-aliases/CompleteDownloadResult.md)\>

Defined in: [src/lib/recipient-otp/completeDownload.ts:29](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/recipient-otp/completeDownload.ts#L29)

Issues presigned URL, updates download consumption counters, and logs success audit.

## Parameters

### doc

[`CommunicationContext`](../../../documents/types/type-aliases/CommunicationContext.md)

### req

`Pick`\<`Request`, `"ip"` \| `"headers"`\>

### now?

`Date` = `...`

### consumptionConfig?

[`VerifyConsumptionConfig`](../../../verify-consumption/type-aliases/VerifyConsumptionConfig.md) = `...`

## Returns

`Promise`\<[`CompleteDownloadResult`](../type-aliases/CompleteDownloadResult.md)\>
