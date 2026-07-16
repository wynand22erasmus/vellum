# Function: resetAuthSessionInFlight()

> **resetAuthSessionInFlight**(): `void`

Defined in: [src/lib/auth-session.ts:13](https://github.com/wynand22erasmus/vellum/blob/df8dd981b8ffb4c4991a6666cd26c449bfb192b3/src/lib/auth-session.ts#L13)

Drop any in-flight session probe so the next load hits the network (after login/logout).

## Returns

`void`
