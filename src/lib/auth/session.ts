import { SignJWT, jwtVerify } from 'jose';
import type { AuthUser } from './types.ts';
import { env } from '../env.ts';

const secret = new TextEncoder().encode(env.sessionSecret);

export async function createSessionToken(user: AuthUser): Promise<string> {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, secret);
  const email = payload.email;
  if (typeof email !== 'string' || typeof payload.sub !== 'string') {
    throw new Error('Invalid session payload');
  }
  return { id: payload.sub, email };
}
