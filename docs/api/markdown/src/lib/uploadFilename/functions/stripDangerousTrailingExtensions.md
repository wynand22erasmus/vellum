# Function: stripDangerousTrailingExtensions()

> **stripDangerousTrailingExtensions**(`basename`): `string`

Defined in: [src/lib/uploadFilename.ts:141](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/uploadFilename.ts#L141)

Removes trailing segments that are dangerous executable types (e.g. `.pdf.exe` → `.pdf`).

## Parameters

### basename

`string`

## Returns

`string`
