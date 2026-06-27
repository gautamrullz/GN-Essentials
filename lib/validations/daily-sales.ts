import { z } from "zod";

export const dailySalesSchema = z.object({
  sale_date: z.string().min(1, "Sale date is required"),

  cash_amount: z.number().min(0, "Cash amount cannot be negative"),

  online_amount: z.number().min(0, "Online amount cannot be negative"),

  other_amount: z.number().min(0, "Other amount cannot be negative"),

  notes: z.string().trim().optional(),
});

export type DailySalesFormValues = z.infer<typeof dailySalesSchema>;
