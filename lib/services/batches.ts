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
          name,
          inventory_type
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

export async function getBatchById(id: string) {
  const { data, error } = await supabase
    .from("batches")
    .select(
      `
        *,
        products (
          id,
          name,
          purchase_price,
          selling_price
        )
      `,
    )
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function getBatchPrefix(productName: string): string {
  const firstWord = productName.replace(/₹\d+/g, "").trim().split(/\s+/)[0];

  return firstWord.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export async function generateBatchNumber(productId: string): Promise<string> {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("name")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    throw new Error("Product not found");
  }

  const priceMatch = product.name.match(/₹(\d+)/);

  if (!priceMatch) {
    throw new Error(
      `Product name must contain selling price. Product: ${product.name}`,
    );
  }

  const sellingPrice = priceMatch[1];
  const prefix = getBatchPrefix(product.name);

  const batchPrefix = `B-${prefix}-${sellingPrice}-`;

  const { data: existingBatches, error: batchError } = await supabase
    .from("batches")
    .select("batch_number")
    .like("batch_number", `${batchPrefix}%`);

  if (batchError) {
    throw batchError;
  }

  let nextNumber = 1;

  if (existingBatches && existingBatches.length > 0) {
    const numbers = existingBatches
      .map((batch) => {
        const parts = batch.batch_number.split("-");
        return Number(parts[parts.length - 1]);
      })
      .filter((num) => !Number.isNaN(num));

    nextNumber = Math.max(...numbers) + 1;
  }

  return `${batchPrefix}${String(nextNumber).padStart(5, "0")}`;
}

export async function createBatch(payload: CreateBatchInput) {
  const batchNumber = await generateBatchNumber(payload.product_id);

  const { data, error } = await supabase
    .from("batches")
    .insert({
      ...payload,
      batch_number: batchNumber,
      status: "ACTIVE",
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
      purchase_date: payload.purchase_date,
      expiry_date: payload.expiry_date,
      quantity: payload.quantity,
      status: payload.quantity === 0 ? "INACTIVE" : "ACTIVE",
    })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
