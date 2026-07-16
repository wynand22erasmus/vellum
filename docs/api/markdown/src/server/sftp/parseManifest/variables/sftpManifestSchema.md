# Variable: sftpManifestSchema

> `const` **sftpManifestSchema**: [`ZodObject`](../../../../lib/documents/uploadSchemas/namespaces/uploadZod/interfaces/ZodObject.md)\<\{ `fileTtl`: [`ZodCoercedNumber`](../../../../lib/documents/uploadSchemas/namespaces/uploadZod/interfaces/ZodCoercedNumber.md)\<`unknown`\>; `linkTtl`: [`ZodCoercedNumber`](../../../../lib/documents/uploadSchemas/namespaces/uploadZod/interfaces/ZodCoercedNumber.md)\<`unknown`\>; `password`: [`ZodString`](../../../../lib/documents/uploadSchemas/namespaces/uploadZod/interfaces/ZodString-1.md); `recipientEmail`: [`ZodString`](../../../../lib/documents/uploadSchemas/namespaces/uploadZod/interfaces/ZodString-1.md); \}, [`$strip`](../../../../lib/documents/uploadSchemas/namespaces/uploadZod/namespaces/core/type-aliases/$strip.md)\>

Defined in: [src/server/sftp/parseManifest.ts:10](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/server/sftp/parseManifest.ts#L10)

Fields required in `{filename}.json` beside an SFTP data file.
