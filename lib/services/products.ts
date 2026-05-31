import { supabase } from "@/lib/supabase/client";

import {
  CreateProductInput,
  ProductWithRelations,
  UpdateProductInput,
} from "@/types/product";

export async function getProducts(): Promise<ProductWithRelations[]> {
  const { data, error } = await supabase
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
    .order("name");

  if (error) {
    throw error;
  }

  return data as ProductWithRelations[];
}

export async function createProduct(payload: CreateProductInput) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      name: payload.name,
      brand: payload.brand || null,
      category_id: payload.category_id,
      sub_category_id: payload.sub_category_id,
      unit_type: payload.unit_type,
      low_stock_limit: payload.low_stock_limit,
      status: payload.status,
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
      sub_category_id: payload.sub_category_id,
      unit_type: payload.unit_type,
      low_stock_limit: payload.low_stock_limit,
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

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
