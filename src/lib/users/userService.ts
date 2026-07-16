/**
 * Persists WorkOS and dev dashboard users in the local `User` table.
 *
 * @packageDocumentation
 */

import type { User as WorkOSUser } from '@workos-inc/node';
import type { User as DbUser, UserKind as PrismaUserKind } from '../../../generated/client.ts';
import { prisma } from '../prisma.ts';
import { env } from '../env.ts';
import type { AuthUser, UserKind } from '../auth/types.ts';

/** @internal */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** @internal */
function resolveKind(email: string, existingKind?: PrismaUserKind): PrismaUserKind {
  if (env.defaultAdminEmails.includes(normalizeEmail(email))) {
    return 'ADMIN';
  }
  return existingKind ?? 'CONSUMER';
}

/** @internal */
function toAuthUser(user: DbUser): AuthUser {
  return {
    id: user.userId,
    email: user.email,
    emailVerified: user.emailVerified,
    kind: user.kind as UserKind,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePictureUrl: user.profilePictureUrl,
  };
}

/**
 * Creates or updates a user from a WorkOS AuthKit profile.
 *
 * @param workosUser - User returned by `authenticateWithCode`
 * @returns Persisted user as {@link AuthUser}
 */
export async function upsertWorkOSUser(workosUser: WorkOSUser): Promise<AuthUser> {
  const existing = await prisma.user.findUnique({ where: { userId: workosUser.id } });
  const kind = resolveKind(workosUser.email, existing?.kind);
  const lastSignInAt = workosUser.lastSignInAt ? new Date(workosUser.lastSignInAt) : new Date();

  const user = await prisma.user.upsert({
    where: { userId: workosUser.id },
    create: {
      userId: workosUser.id,
      email: normalizeEmail(workosUser.email),
      emailVerified: workosUser.emailVerified,
      kind,
      firstName: workosUser.firstName,
      lastName: workosUser.lastName,
      profilePictureUrl: workosUser.profilePictureUrl,
      lastSignInAt,
    },
    update: {
      email: normalizeEmail(workosUser.email),
      emailVerified: workosUser.emailVerified,
      kind,
      firstName: workosUser.firstName,
      lastName: workosUser.lastName,
      profilePictureUrl: workosUser.profilePictureUrl,
      lastSignInAt,
    },
  });

  return toAuthUser(user);
}

/**
 * Creates or updates a dev-auth user (`dev:{email}` id).
 *
 * @remarks New users start with `emailVerified: false` until they use
 * `createEmailVerificationToken` (dev Mailpit flow). When
 * `SKIP_EMAIL_VERIFICATION` is enabled, new users are created as verified.
 *
 * @param email - Recipient email from `X-Dev-User-Email`
 */
export async function upsertDevUser(email: string): Promise<AuthUser> {
  const normalized = normalizeEmail(email);
  const userId = `dev:${normalized}`;
  const existing = await prisma.user.findUnique({ where: { userId } });
  const kind = resolveKind(normalized, existing?.kind);
  const verifiedOnCreate = env.skipEmailVerification;

  const user = await prisma.user.upsert({
    where: { userId },
    create: {
      userId,
      email: normalized,
      emailVerified: verifiedOnCreate,
      kind,
      lastSignInAt: new Date(),
    },
    update: {
      email: normalized,
      kind,
      lastSignInAt: new Date(),
    },
  });

  return toAuthUser(user);
}

/**
 * Marks a user's email as verified after they follow the dev verification link.
 *
 * @param userId - Primary key in `User`
 */
export async function markEmailVerified(userId: string): Promise<AuthUser> {
  const user = await prisma.user.update({
    where: { userId },
    data: { emailVerified: true },
  });
  return toAuthUser(user);
}

/**
 * Loads a user by id for session validation.
 *
 * @param id - Session subject (`sub` claim)
 */
export async function findUserById(id: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { userId: id } });
  return user ? toAuthUser(user) : null;
}
