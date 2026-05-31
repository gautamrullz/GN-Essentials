import { supabase } from "@/lib/supabase/client";

import { InventoryTransactionWithRelations } from "@/types/transaction";

export async function getTransactions(): Promise<
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
    });

  if (error) {
    throw error;
  }

  return data as InventoryTransactionWithRelations[];
}
