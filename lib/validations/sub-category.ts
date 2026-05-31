import { z } from "zod";

export const subCategorySchema = z.object({
  category_id: z.string().min(1, "Category is required"),

  name: z.string().trim().min(2, "Sub Category name is required"),
});

export type SubCategoryFormValues = z.infer<typeof subCategorySchema>;
