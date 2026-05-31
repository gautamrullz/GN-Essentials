import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),

  brand: z.string().optional(),

  category_id: z.string().min(1, "Category is required"),

  sub_category_id: z.string().min(1, "Sub Category is required"),

  unit_type: z.string().min(1, "Unit Type is required"),

  low_stock_limit: z.number(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
