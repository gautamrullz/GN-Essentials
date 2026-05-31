// lib/validations/supplier.ts

import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().trim().min(2, "Supplier name is required"),

  phone: z.string().optional(),

  gst_number: z.string().optional(),

  address: z.string().optional(),

  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
