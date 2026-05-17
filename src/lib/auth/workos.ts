import { WorkOS } from '@workos-inc/node';
import { env } from '../env.ts';

let workosClient: WorkOS | null = null;

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

export function getAuthorizationUrl(): string {
  const workos = getWorkOS();
  const clientId = env.workosClientId()!;
  return workos.userManagement.getAuthorizationUrl({
    clientId,
    redirectUri: env.workosRedirectUri,
    provider: 'authkit',
  });
}
