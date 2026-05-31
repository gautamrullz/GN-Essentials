import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required"),
});

export type CategoryFormValues =
  z.infer<typeof categorySchema>;