/**
 * WorkOS AuthKit client for production dashboard sign-in.
 *
 * @packageDocumentation
 */

import { WorkOS } from '@workos-inc/node';
import { env } from '../env.ts';

/** @internal */
let workosClient: WorkOS | null = null;

/**
 * Returns a singleton WorkOS SDK client.
 *
 * @throws {Error} When `WORKOS_API_KEY` or `WORKOS_CLIENT_ID` is unset
 */
export function getWorkOS(): WorkOS {
  const apiKey = env.workosApiKey();
  const clientId = env.workosClientId();
  if (!apiKey || !clientId) {
    throw new Error('WorkOS is not configured. Set WORKOS_API_KEY and WORKOS_CLIENT_ID.');
  }
  if (!workosClient) {
    workosClient = new WorkOS(apiKey);
  }
  return workosClient;
}

/**
 * Builds the AuthKit authorization URL for the OAuth redirect flow.
 *
 * @returns URL to redirect the browser to `/api/auth/login`
 */
export function getAuthorizationUrl(): string {
  const workos = getWorkOS();
  const clientId = env.workosClientId()!;
  return workos.userManagement.getAuthorizationUrl({
    clientId,
    redirectUri: env.workosRedirectUri,
    provider: 'authkit',
  });
}
