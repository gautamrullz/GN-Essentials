import { supabase } from "@/lib/supabase/client";

import {
  BatchWithRelations,
  CreateBatchInput,
  UpdateBatchInput,
} from "@/types/batch";

export async function getBatches(): Promise<BatchWithRelations[]> {
  const { data, error } = await supabase
    .from("batches")
    .select(
      `
        *,
        products (
          id,
          name
        ),
        suppliers (
          id,
          name
        )
      `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data as BatchWithRelations[];
}

export async function createBatch(payload: CreateBatchInput) {
  const { data, error } = await supabase
    .from("batches")
    .insert({
      ...payload,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  /**
   * Create PURCHASE transaction
   */
  await supabase.from("inventory_transactions").insert({
    batch_id: data.id,
    product_id: payload.product_id,
    transaction_type: "PURCHASE",
    quantity: payload.quantity,
    notes: "Initial batch purchase",
  });

  return data;
}

export async function updateBatch(payload: UpdateBatchInput) {
  const { data, error } = await supabase
    .from("batches")
    .update({
      product_id: payload.product_id,
      supplier_id: payload.supplier_id,
      batch_number: payload.batch_number,
      manufacture_date: payload.manufacture_date,
      purchase_date: payload.purchase_date,
      expiry_date: payload.expiry_date,
      quantity: payload.quantity,
      purchase_price: payload.purchase_price,
      selling_price: payload.selling_price,
      status: payload.status,
    })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteBatch(id: string) {
  const { error } = await supabase.from("batches").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
