import { supabase } from "@/lib/supabase/client";

import { ExpiringBatch, LowStockProduct } from "@/types/alert";

export async function getLowStockProducts(): Promise<LowStockProduct[]> {
  const { data: products } = await supabase.from("products").select("*");

  const { data: batches } = await supabase.from("batches").select("*");

  if (!products || !batches) {
    return [];
  }

  const result: LowStockProduct[] = products
    .map((product) => {
      const stock = batches
        .filter((batch) => batch.product_id === product.id)
        .reduce((sum, batch) => sum + Number(batch.quantity), 0);

      return {
        id: product.id,
        name: product.name,
        low_stock_limit: product.low_stock_limit,
        current_stock: stock,
      };
    })
    .filter((product) => product.current_stock <= product.low_stock_limit);

  return result;
}

export async function getExpiringBatches(): Promise<ExpiringBatch[]> {
  const today = new Date();

  const next30Days = new Date();

  next30Days.setDate(today.getDate() + 30);

  const { data, error } = await supabase.from("batches").select(
    `
        id,
        batch_number,
        expiry_date,
        products (
          id,
          name
        )
      `,
  );

  if (error) {
    throw error;
  }

  const expiringBatches = (data ?? []).filter((batch) => {
    const expiry = new Date(batch.expiry_date);

    return expiry >= today && expiry <= next30Days;
  });

  return expiringBatches as ExpiringBatch[];
}
