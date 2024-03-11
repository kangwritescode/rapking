import { appRouter } from 'src/server/api/root';
import { CreateContextOptions, createInnerTRPCContext, t } from 'src/server/api/trpc';
import prisma from './db';

export function createCaller(ctxOptions: CreateContextOptions) {
  const ctx = createInnerTRPCContext(ctxOptions);

  ctx.prisma = prisma;

  const createCaller = t.createCallerFactory(appRouter);
  const caller = createCaller(ctx);

  return caller;
}
