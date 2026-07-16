# Type Alias: CommunicationContext

> **CommunicationContext** = `Communication` & `Document` & `object`

Defined in: [src/lib/documents/types.ts:28](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/documents/types.ts#L28)

Flattened verify context from a joined link graph.

## Type Declaration

### authenticatorSecretEnc

> **authenticatorSecretEnc**: `string` \| `null`

### deletedAt

> **deletedAt**: `Date` \| `null`

### email

> **email**: `string`

### fileExpiresAt

> **fileExpiresAt**: `Date`

### fileId

> **fileId**: `string`

### fileName

> **fileName**: `string`

### otpChannel

> **otpChannel**: `Recipient`\[`"otpChannel"`\]

### phoneNumber

> **phoneNumber**: `string` \| `null`

### recipientId

> **recipientId**: `string`

### recordExpiresAt

> **recordExpiresAt**: `Date`

### s3Key

> **s3Key**: `string` \| `null`

### sha256

> **sha256**: `string`

### sourceSystemKey

> **sourceSystemKey**: `string`
