# Function: scanBuffer()

> **scanBuffer**(`buffer`): `Promise`\<\{ `clean`: `boolean`; `reason?`: `string`; \}\>

Defined in: [src/lib/clamav.ts:40](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/clamav.ts#L40)

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
