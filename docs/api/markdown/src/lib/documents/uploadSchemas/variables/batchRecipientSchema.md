# Variable: batchRecipientSchema

> `const` **batchRecipientSchema**: [`ZodObject`](../namespaces/uploadZod/interfaces/ZodObject.md)\<\{ `fileTtl`: [`ZodCoercedNumber`](../namespaces/uploadZod/interfaces/ZodCoercedNumber.md)\<`unknown`\>; `linkTtl`: [`ZodCoercedNumber`](../namespaces/uploadZod/interfaces/ZodCoercedNumber.md)\<`unknown`\>; `maxDownloads`: [`ZodOptional`](../namespaces/uploadZod/interfaces/ZodOptional.md)\<[`ZodCoercedNumber`](../namespaces/uploadZod/interfaces/ZodCoercedNumber.md)\<`unknown`\>\>; `otpChannel`: [`ZodOptional`](../namespaces/uploadZod/interfaces/ZodOptional.md)\<[`ZodEnum`](../namespaces/uploadZod/interfaces/ZodEnum.md)\<\{ `authenticator`: `"authenticator"`; `email`: `"email"`; `sms`: `"sms"`; `whatsapp`: `"whatsapp"`; \}\>\>; `password`: [`ZodString`](../namespaces/uploadZod/interfaces/ZodString-1.md); `recipientEmail`: [`ZodString`](../namespaces/uploadZod/interfaces/ZodString-1.md); `recipientPhone`: [`ZodOptional`](../namespaces/uploadZod/interfaces/ZodOptional.md)\<[`ZodString`](../namespaces/uploadZod/interfaces/ZodString-1.md)\>; \}, [`$strip`](../namespaces/uploadZod/namespaces/core/type-aliases/$strip.md)\>

Defined in: src/lib/documents/uploadSchemas.ts:60

One recipient entry in a batch upload JSON array.
