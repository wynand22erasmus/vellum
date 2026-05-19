import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../prisma.ts', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock('../env.ts', () => ({
  env: {
    defaultAdminEmails: ['admin@example.com'],
    skipEmailVerification: false,
  },
}));

import { prisma } from '../prisma.ts';
import { upsertDevUser } from './userService.ts';

describe('upsertDevUser', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('assigns ADMIN when email is in default admin list', async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.upsert).mockResolvedValue({
      id: 'dev:admin@example.com',
      email: 'admin@example.com',
      emailVerified: true,
      kind: 'ADMIN',
      firstName: null,
      lastName: null,
      profilePictureUrl: null,
      lastSignInAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await upsertDevUser('Admin@Example.com');
    expect(user.kind).toBe('ADMIN');
    expect(prisma.user.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ kind: 'ADMIN' }),
      }),
    );
  });
});
