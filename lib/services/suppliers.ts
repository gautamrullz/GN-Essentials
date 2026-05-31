import { CreateSupplierInput, UpdateSupplierInput } from "@/types/supplier";
import { supabase } from "@/lib/supabase/client";

export async function getSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}

export async function createSupplier(payload: CreateSupplierInput) {
  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      name: payload.name,
      phone: payload.phone || null,
      gst_number: payload.gst_number || null,
      address: payload.address || null,
      status: payload.status ?? "ACTIVE",
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateSupplier(payload: UpdateSupplierInput) {
  const { data, error } = await supabase
    .from("suppliers")
    .update({
      name: payload.name,
      phone: payload.phone || null,
      gst_number: payload.gst_number || null,
      address: payload.address || null,
      status: payload.status,
    })
    .eq("id", payload.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteSupplier(id: string) {
  const { error } = await supabase.from("suppliers").delete().eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
