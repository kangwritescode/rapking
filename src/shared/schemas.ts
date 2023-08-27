import { z } from "zod";

export const rapSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Rap = z.infer<typeof rapSchema>;

export const rapCreateInputSchema = z.object({
  title: z.string(),
  content: z.string(),
});
