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

  const stockMap = new Map<string, number>();

  batches.forEach((batch) => {
    const current = stockMap.get(batch.product_id) ?? 0;

    stockMap.set(batch.product_id, current + Number(batch.quantity ?? 0));
  });

  const totalProducts = products.length;

  const totalBatches = batches.length;

  const totalStock = Array.from(stockMap.values()).reduce(
    (sum, stock) => sum + stock,
    0,
  );

  const inventoryValue = batches.reduce(
    (sum, batch) =>
      sum + Number(batch.quantity ?? 0) * Number(batch.purchase_price ?? 0),
    0,
  );

  const lowStockProducts = products.filter((product) => {
    const stock = stockMap.get(product.id) ?? 0;

    return stock <= Number(product.low_stock_limit ?? 0);
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
