import { SocialLink } from '@prisma/client';
import { inferProcedureInput } from '@trpc/server';
import { AppRouter, appRouter } from 'src/server/api/root';
import { createInnerTRPCContext, t } from 'src/server/api/trpc';
import { prisma } from 'src/server/db';
import { Mock, expect, test, vi } from 'vitest';

vi.mock('src/server/db', () => ({
  prisma: {
    socialLink: {
      findMany: vi.fn()
    }
  }
}));

test('getSocialLinkByUserId returns mock data', async () => {
  const mockSocialLinks: SocialLink[] = [
    {
      id: '1',
      userId: '123',
      platform: 'TWITTER',
      link: 'https://twitter.com/johndoe',
      displayText: 'John Doe on Twitter'
    }
  ];

  (prisma.socialLink.findMany as Mock).mockResolvedValue(mockSocialLinks);

  const ctx = createInnerTRPCContext({
    session: {
      user: {
        id: '123',
        username: 'John Doe',
        profileIsComplete: true,
        isWhitelisted: true,
        isAdmin: true
      },
      expires: '1'
    }
  });

  const createCaller = t.createCallerFactory(appRouter);
  const caller = createCaller(ctx);

  const input: inferProcedureInput<AppRouter['socialLink']['getSocialLinkByUserId']> = {
    userId: '123'
  };

  const result = await caller.socialLink.getSocialLinkByUserId(input);

  expect(result).toEqual(mockSocialLinks);
});
