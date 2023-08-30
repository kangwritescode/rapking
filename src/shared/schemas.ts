import { z } from "zod";

const rapStatusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const rapSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  status: rapStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Rap = z.infer<typeof rapSchema>;

export type RapStatus = z.infer<typeof rapStatusSchema>;
