import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { htmlToText } from 'html-to-text';
import { env } from 'src/env.mjs';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';
import { z } from 'zod';

export const pulseRouter = createTRPCRouter({
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.pulsePost.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }),
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to create a post'
        });
      }

      const createdPost = await ctx.prisma.pulsePost.create({
        data: {
          content: input.content
        }
      });

      if (env.NODE_ENV === 'production') {
        await sendPulseChannelUpdate({
          content: htmlToText(createdPost.content)
        });
      }

      return createdPost;
    }),
  deletePost: protectedProcedure
    .input(
      z.object({
        id: z.number()
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You are not allowed to delete a post'
        });
      }

      return await ctx.prisma.pulsePost.delete({
        where: {
          id: input.id
        }
      });
    })
});

async function sendPulseChannelUpdate({ content }: { content: string }) {
  try {
    const response = await axios.post(env.PULSE_BOT_WEBHOOK_URL, {
      content
    });

    console.log('Webhook response:', response.data);
  } catch (error: any) {
    console.error('Error sending webhook:', error.message);
  }
}
