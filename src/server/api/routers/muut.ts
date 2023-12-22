import crypto from 'crypto';
import { env } from 'src/env.mjs';
import { createTRPCRouter, protectedProcedure } from 'src/server/api/trpc';
import { BUCKET_URL } from 'src/shared/constants';

// Add this type for user data
type MuutUser = {
  id: string;
  displayname: string | null;
  email?: string | null;
  avatar?: string | null;
  is_admin: boolean;
};

export const muutRouter = createTRPCRouter({
  generateMuutCredentials: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id
      }
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    try {
      const user: MuutUser = {
        id: currentUser.id,
        displayname: currentUser.username,
        email: currentUser.email, // Optional
        avatar: `${BUCKET_URL}/${currentUser.profileImageUrl}`,
        is_admin: false
      };

      const message = Buffer.from(JSON.stringify({ user })).toString('base64');
      const timestamp = Math.floor(Date.now() / 1000);
      const signatureString = `${env.MUUT_SECRET_KEY} ${message} ${timestamp}`;
      const signature = crypto.createHash('sha1').update(signatureString).digest('hex');

      return {
        message,
        signature,
        timestamp,
        apiKey: env.MUUT_API_KEY // Include API key if needed
      };
    } catch (error) {
      console.error('Error generating Muut credentials:', error);
      throw new Error('Failed to generate Muut credentials');
    }
  })
});
