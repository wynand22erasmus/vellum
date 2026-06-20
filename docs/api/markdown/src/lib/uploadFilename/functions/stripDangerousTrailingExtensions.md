# Function: stripDangerousTrailingExtensions()

> **stripDangerousTrailingExtensions**(`basename`): `string`

Defined in: [src/lib/uploadFilename.ts:141](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/uploadFilename.ts#L141)

Removes trailing segments that are dangerous executable types (e.g. `.pdf.exe` → `.pdf`).

## Parameters

### basename

`string`

## Returns

`string`
