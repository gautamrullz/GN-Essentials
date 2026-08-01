import { supabase } from "@/lib/supabase/client";

import {
  CreateDailySaleInput,
  DailySale,
  UpdateDailySaleInput,
} from "@/types/daily-sales";

export async function getDailySales(
  startDate: string,
  endDate: string,
): Promise<DailySale[]> {
  const { data, error } = await supabase
    .from("daily_sales")
    .select("*")
    .gte("sale_date", startDate)
    .lt("sale_date", endDate)
    .order("sale_date", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data as DailySale[];
}

export async function getDailySaleByDate(
  saleDate: string,
): Promise<DailySale | null> {
  const { data, error } = await supabase
    .from("daily_sales")
    .select("*")
    .eq("sale_date", saleDate)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as DailySale | null;
}

export async function createDailySale(payload: CreateDailySaleInput) {
  const totalAmount =
    payload.cash_amount + payload.online_amount + payload.other_amount;

  const { data, error } = await supabase
    .from("daily_sales")
    .insert({
      sale_date: payload.sale_date,
      cash_amount: payload.cash_amount,
      online_amount: payload.online_amount,
      other_amount: payload.other_amount,
      total_amount: totalAmount,
      notes: payload.notes ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateDailySale(
  id: string,
  payload: UpdateDailySaleInput,
) {
  const { data: existingSale, error: fetchError } = await supabase
    .from("daily_sales")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  const cashAmount = payload.cash_amount ?? Number(existingSale.cash_amount);

  const onlineAmount =
    payload.online_amount ?? Number(existingSale.online_amount);

  const otherAmount = payload.other_amount ?? Number(existingSale.other_amount);

  const totalAmount = cashAmount + onlineAmount + otherAmount;

  const { data, error } = await supabase
    .from("daily_sales")
    .update({
      sale_date: payload.sale_date ?? existingSale.sale_date,
      cash_amount: cashAmount,
      online_amount: onlineAmount,
      other_amount: otherAmount,
      total_amount: totalAmount,
      notes: payload.notes ?? existingSale.notes,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getLifetimeSalesSummary() {
  const { data, error } = await supabase.rpc("get_lifetime_sales_summary");
  if (error) {
    throw error;
  }
  const summary = data?.[0];

  return {
    total_sales: Number(summary?.total_sales ?? 0),
    total_cash: Number(summary?.total_cash ?? 0),
    total_online: Number(summary?.total_online ?? 0),
    total_other: Number(summary?.total_other ?? 0),
    days_recorded: Number(summary?.days_recorded ?? 0),
    first_sale_date: summary?.first_sale_date ?? null,
  };
}
