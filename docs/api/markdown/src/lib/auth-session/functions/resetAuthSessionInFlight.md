# Function: resetAuthSessionInFlight()

> **resetAuthSessionInFlight**(): `void`

Defined in: [src/lib/auth-session.ts:13](https://github.com/wynand22erasmus/vellum/blob/02442fedaf00245060c21695c36ee0c2b9e841c3/src/lib/auth-session.ts#L13)

Drop any in-flight session probe so the next load hits the network (after login/logout).

## Returns

`void`
