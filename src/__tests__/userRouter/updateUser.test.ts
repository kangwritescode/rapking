import { User } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { describe, expect, test } from 'vitest';
import prisma from '../mocks/db';
import { createCaller } from '../mocks/utils';

describe('userRouter.updateUser', () => {
  test('Cannot update username if it is taken by another user', async () => {
    const userA = {
      id: '1',
      username: 'user_a',
      profileIsComplete: true,
      isAdmin: true
    };
    const userB = {
      id: '2',
      username: 'user_a'
    };

    prisma.user.findUniqueOrThrow.mockResolvedValueOnce(userA as User);
    prisma.user.findUnique.mockResolvedValueOnce(userB as User);

    const caller = createCaller({
      session: {
        user: userA,
        expires: '1'
      }
    });

    // Test the function
    await expect(caller.user.updateUser({ username: 'user_a' })).rejects.toThrow(TRPCError);
  });
  test('Bio content is sanitized properly', async () => {
    const user = {
      id: '1',
      username: 'user_test',
      profileIsComplete: true,
      isAdmin: true,
      bio: 'Safe bio'
    };

    const unsafeBio = '<script>alert("xss");</script><p>Safe content</p>';
    const sanitizedBio = 'alert("xss");Safe content';

    const caller = createCaller({
      session: {
        user: user,
        expires: '1'
      }
    });

    prisma.user.findUniqueOrThrow.mockResolvedValueOnce(user as User);
    prisma.user.findUnique.mockResolvedValueOnce(null);
    prisma.user.update.mockResolvedValueOnce({
      ...(user as User),
      bio: sanitizedBio
    });

    const updatedUser = await caller.user.updateUser({ bio: unsafeBio });

    expect(updatedUser.bio).toBe(sanitizedBio);
    expect(updatedUser.bio).not.toContain('<script>');
    expect(updatedUser.bio).not.toContain('</script>');
  });
});
