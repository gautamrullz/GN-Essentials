import { z } from "zod";

export const batchSchema = z.object({
  product_id: z.string().min(1, "Product is required"),

  supplier_id: z.string().min(1, "Supplier is required"),

  batch_number: z.string().trim().min(1, "Batch number is required"),

  purchase_date: z.string(),

  expiry_date: z.string(),

  quantity: z.number().min(1),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type BatchFormValues = z.infer<typeof batchSchema>;
