# Function: buildSidebarNav()

> **buildSidebarNav**(`options`): [`SidebarNavModel`](../type-aliases/SidebarNavModel.md)

Defined in: [src/lib/sidebar-nav.ts:57](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/sidebar-nav.ts#L57)

Builds the sidebar navigation model for the current user and dev services.

## Parameters

### options

Session user and available dev service links

#### devServices

[`DevServiceLink`](../../dev-services/type-aliases/DevServiceLink.md)[]

#### user

[`AuthUser`](../../auth/types/interfaces/AuthUser.md) \| `null`

## Returns

[`SidebarNavModel`](../type-aliases/SidebarNavModel.md)
