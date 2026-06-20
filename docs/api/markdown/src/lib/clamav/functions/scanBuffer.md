# Function: scanBuffer()

> **scanBuffer**(`buffer`): `Promise`\<\{ `clean`: `boolean`; `reason?`: `string`; \}\>

Defined in: [src/lib/clamav.ts:40](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/clamav.ts#L40)

Scans a file buffer via ClamAV `zINSTREAM`.

## Parameters

### buffer

`Buffer`

Raw upload bytes

## Returns

`Promise`\<\{ `clean`: `boolean`; `reason?`: `string`; \}\>

`clean: true` or `clean: false` with a signature name in `reason`

## Throws

`AppError` When ClamAV is unreachable or returns an unexpected response
