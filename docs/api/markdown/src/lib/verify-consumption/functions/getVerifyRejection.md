# Function: getVerifyRejection()

> **getVerifyRejection**(`doc`, `now`, `config`): [`VerifyRejectionReason`](../type-aliases/VerifyRejectionReason.md) \| `null`

Defined in: [src/lib/verify-consumption.ts:36](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/verify-consumption.ts#L36)

Returns whether verify should be rejected before password check.

## Parameters

### doc

[`VerifyConsumptionDocument`](../type-aliases/VerifyConsumptionDocument.md)

### now

`Date`

### config

[`VerifyConsumptionConfig`](../type-aliases/VerifyConsumptionConfig.md)

## Returns

[`VerifyRejectionReason`](../type-aliases/VerifyRejectionReason.md) \| `null`
