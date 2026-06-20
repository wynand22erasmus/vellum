# Function: getEmailTheme()

> **getEmailTheme**(`preset`, `appUrl`): [`EmailTheme`](../type-aliases/EmailTheme.md)

Defined in: src/lib/brand/email-theme.ts:33

Merge [BrandPreset](../../presets/type-aliases/BrandPreset.md) email defaults with optional `BRAND_*` env overrides.

## Parameters

### preset

[`BrandPreset`](../../presets/type-aliases/BrandPreset.md)

Active brand preset

### appUrl

`string`

Public app base URL (for relative logo paths)

## Returns

[`EmailTheme`](../type-aliases/EmailTheme.md)
