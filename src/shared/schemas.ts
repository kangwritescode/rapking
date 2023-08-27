import { z } from "zod";

export const rapSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
});

export type Rap = z.infer<typeof rapSchema>;
