import { supabase } from "@/lib/supabase/client";

import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}

export async function createCategory(
  payload: CreateCategoryInput
) {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: payload.name,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCategory(
  payload: UpdateCategoryInput
) {
  const { data, error } = await supabase
    .from("categories")
    .update({
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

export async function deleteCategory(
  id: string
) {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}