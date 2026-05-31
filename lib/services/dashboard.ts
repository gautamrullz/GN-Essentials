import { supabase } from "@/lib/supabase/client";

export interface DashboardMetrics {
  totalProducts: number;
  totalBatches: number;
  totalStock: number;
  inventoryValue: number;
  lowStockProducts: number;
  expiringSoon: number;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const [productsResult, batchesResult] = await Promise.all([
    supabase.from("products").select("*"),
    supabase.from("batches").select("*"),
  ]);

  const products = productsResult.data ?? [];

  const batches = batchesResult.data ?? [];

  const totalProducts = products.length;

  const totalBatches = batches.length;

  const totalStock = batches.reduce(
    (sum, batch) => sum + Number(batch.quantity ?? 0),
    0,
  );

  const inventoryValue = batches.reduce(
    (sum, batch) =>
      sum + Number(batch.quantity ?? 0) * Number(batch.purchase_price ?? 0),
    0,
  );

  const lowStockProducts = products.filter((product) => {
    const productStock = batches
      .filter((batch) => batch.product_id === product.id)
      .reduce((sum, batch) => sum + Number(batch.quantity ?? 0), 0);

    return productStock <= Number(product.low_stock_limit ?? 0);
  }).length;

  const today = new Date();

  const next30Days = new Date();

  next30Days.setDate(today.getDate() + 30);

  const expiringSoon = batches.filter((batch) => {
    if (!batch.expiry_date) {
      return false;
    }

    const expiryDate = new Date(batch.expiry_date);

    return expiryDate >= today && expiryDate <= next30Days;
  }).length;

  return {
    totalProducts,
    totalBatches,
    totalStock,
    inventoryValue,
    lowStockProducts,
    expiringSoon,
  };
}
