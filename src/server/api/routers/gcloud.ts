import { z } from 'zod';

import { generateSignedUrl } from 'src/gcloud/serverMethods';
import { createTRPCRouter, protectedProcedure, publicProcedure } from 'src/server/api/trpc';

const isDevelopment = process.env.NODE_ENV === 'development';

export const gcloudRouter = createTRPCRouter({
  generateWriteUrl: publicProcedure
    .input(
      z.object({
        fileName: z.string()
      })
    )
    .query(async ({ input }) => {
      if (isDevelopment) {
        return '';
      }

      const { fileName } = input;
      const signedUrl = await generateSignedUrl(
        fileName,
        'write',
        'application/octet-stream'
      ).catch(err => console.log(err));

      return signedUrl;
    }),
  generateDeleteUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string()
      })
    )
    .query(async ({ input }) => {
      if (isDevelopment) {
        return '';
      }
      const { fileName } = input;
      const signedUrl = await generateSignedUrl(fileName, 'delete').catch(err => console.log(err));

      return signedUrl;
    })
});
