import { supabase } from "@/lib/supabase/client";

import {
  CreateSubCategoryInput,
  UpdateSubCategoryInput,
} from "@/types/sub-category";

export async function getSubCategories() {
  const { data, error } = await supabase
    .from("sub_categories")
    .select(
      `
      *,
      categories (
        id,
        name
      )
    `,
    )
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}

export async function createSubCategory(payload: CreateSubCategoryInput) {
  const { data, error } = await supabase
    .from("sub_categories")
    .insert({
      category_id: payload.category_id,
      name: payload.name,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSubCategory(payload: UpdateSubCategoryInput) {
  const { data, error } = await supabase
    .from("sub_categories")
    .update({
      category_id: payload.category_id,
      name: payload.name,
    })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSubCategory(id: string) {
  const { error } = await supabase.from("sub_categories").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
