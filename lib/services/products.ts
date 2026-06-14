import { supabase } from "@/lib/supabase/client";

import {
  CreateProductInput,
  ProductWithRelations,
  UpdateProductInput,
} from "@/types/product";

export async function getProducts(): Promise<ProductWithRelations[]> {
  const [
    { data: products, error: productsError },
    { data: batches, error: batchesError },
  ] = await Promise.all([
    supabase
      .from("products")
      .select(
        `
            *,
            categories (
              id,
              name
            ),
            sub_categories (
              id,
              name
            )
          `,
      )
      .order("name"),

    supabase.from("batches").select("product_id, quantity"),
  ]);

  if (productsError) {
    throw productsError;
  }

  if (batchesError) {
    throw batchesError;
  }

  const stockMap = new Map<string, number>();

  batches?.forEach((batch) => {
    const current = stockMap.get(batch.product_id) ?? 0;

    stockMap.set(batch.product_id, current + Number(batch.quantity ?? 0));
  });

  return (products ?? []).map((product) => ({
    ...product,
    current_stock: stockMap.get(product.id) ?? 0,
  })) as ProductWithRelations[];
}

export async function createProduct(payload: CreateProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: payload.name,
      brand: payload.brand || null,
      category_id: payload.category_id,
      sub_category_id: payload.sub_category_id || null,
      unit_type: payload.unit_type,
      low_stock_limit: payload.low_stock_limit,
      status: payload.status,
      purchase_price: payload.purchase_price,
      selling_price: payload.selling_price,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProduct(payload: UpdateProductInput) {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: payload.name,
      brand: payload.brand || null,
      category_id: payload.category_id,
      sub_category_id: payload.sub_category_id || null,
      unit_type: payload.unit_type,
      low_stock_limit: payload.low_stock_limit,
      status: payload.status,
      purchase_price: payload.purchase_price,
      selling_price: payload.selling_price,
    })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
