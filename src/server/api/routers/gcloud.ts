import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "src/server/api/trpc";
import { generateSignedUrl } from "src/gcloud/serverMethods";

export const gcloudRouter = createTRPCRouter({
  generateWriteUrl: protectedProcedure
    .input(z.object({
      fileName: z.string(),
    }))
    .query(async ({ input }) => {
      const { fileName } = input;
      const signedUrl = await generateSignedUrl(fileName, 'write', 'application/octet-stream').catch((err) => console.log(err));

      return signedUrl
    }),
  generateDeleteUrl: protectedProcedure
    .input(z.object({
      fileName: z.string(),
    }))
    .query(async ({ input }) => {
      const { fileName } = input;
      const signedUrl = await generateSignedUrl(fileName, 'delete').catch((err) => console.log(err));

      return signedUrl
    }),
});

