import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "src/server/api/trpc";
import { generateV4UploadSignedUrl } from "src/gcloud/serverMethods";

export const gcloudRouter = createTRPCRouter({
  generatePresignedUrl: protectedProcedure
    .input(z.object({
      fileName: z.string(),
    }))
    .query(async ({ input }) => {
      const { fileName } = input;
      const signedUrl = await generateV4UploadSignedUrl(fileName).catch((err) => console.log(err));

      return signedUrl
    }),
});

