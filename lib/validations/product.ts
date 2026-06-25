import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),

  brand: z.string().optional(),

  category_id: z.string().min(1, "Category is required"),

  sub_category_id: z.string().nullable(),

  unit_type: z.string().min(1, "Unit Type is required"),

  low_stock_limit: z.number(),

  purchase_price: z.number().min(0, "Purchase price must be a positive number"),

  selling_price: z.number().min(0, "Selling price must be a positive number"),

  status: z.enum(["ACTIVE", "INACTIVE"]),

  inventory_type: z.enum(["STANDARD", "FAST_MOVING"]),
});

export type ProductFormValues = z.infer<typeof productSchema>;
