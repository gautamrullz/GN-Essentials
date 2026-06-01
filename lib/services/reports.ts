import { supabase } from "@/lib/supabase/client";

import {
  InventoryValuationRow,
  StockReportRow,
  ExpiryReportRow,
} from "@/types/report";

import { InventoryTransactionWithRelations } from "@/types/transaction";

export async function getInventoryValuation(): Promise<
  InventoryValuationRow[]
> {
  const { data, error } = await supabase.from("batches").select(`
      quantity,
      purchase_price,
      batch_number,
      products (
        name
      )
    `);

  if (error) {
    throw error;
  }

  console.log(data);

  return (data ?? []).map((batch) => ({
    product_name:
      (
        batch.products as unknown as {
          name: string;
        } | null
      )?.name ?? "Unknown",
    batch_number: batch.batch_number,
    quantity: Number(batch.quantity),
    purchase_price: Number(batch.purchase_price),
    inventory_value: Number(batch.quantity) * Number(batch.purchase_price),
  }));
}

export async function getStockReport(): Promise<StockReportRow[]> {
  const { data: products } = await supabase.from("products").select("*");

  const { data: batches } = await supabase.from("batches").select("*");

  if (!products || !batches) {
    return [];
  }

  return products.map((product) => {
    const currentStock = batches
      .filter((batch) => batch.product_id === product.id)
      .reduce((sum, batch) => sum + Number(batch.quantity), 0);

    return {
      product_name: product.name,
      current_stock: currentStock,
      low_stock_limit: product.low_stock_limit,
      status: currentStock <= product.low_stock_limit ? "LOW STOCK" : "NORMAL",
    };
  });
}

export async function getExpiryReport(): Promise<ExpiryReportRow[]> {
  const { data, error } = await supabase.from("batches").select(`
      batch_number,
      expiry_date,
      products (
        name
      )
    `);

  if (error) {
    throw error;
  }

  return (data ?? []).map((batch) => {
    const expiryDate = new Date(batch.expiry_date);

    const today = new Date();

    const daysLeft = Math.ceil(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    return {
      product_name:
        (
          batch.products as unknown as {
            name: string;
          } | null
        )?.name ?? "Unknown",
      batch_number: batch.batch_number,
      expiry_date: batch.expiry_date,
      days_left: daysLeft,
    };
  });
}

export async function getRecentTransactions(): Promise<
  InventoryTransactionWithRelations[]
> {
  const { data, error } = await supabase
    .from("inventory_transactions")
    .select(
      `
      *,
      products (
        id,
        name
      ),
      batches (
        id,
        batch_number
      )
    `,
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(10);

  if (error) {
    throw error;
  }

  return data as InventoryTransactionWithRelations[];
}
