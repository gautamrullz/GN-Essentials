import { supabase } from "@/lib/supabase/client";

import { StockMovementInput } from "@/types/stock-movement";

import { Batch } from "@/types/batch";

export async function createStockMovement(
  payload: StockMovementInput,
) {
  const { data: batch, error: batchError } =
    await supabase
      .from("batches")
      .select("*")
      .eq("id", payload.batch_id)
      .single();

  if (batchError || !batch) {
    throw new Error("Batch not found");
  }

  const currentBatch = batch as Batch;

  let newQuantity =
    currentBatch.quantity;

  switch (
    payload.transaction_type
  ) {
    case "SALE":
    case "DAMAGE":
    case "WASTAGE":
      newQuantity =
        currentBatch.quantity -
        payload.quantity;

      if (newQuantity < 0) {
        throw new Error(
          "Quantity exceeds available stock",
        );
      }
      break;

    case "RETURN":
      newQuantity =
        currentBatch.quantity +
        payload.quantity;
      break;

    case "ADJUSTMENT":
      newQuantity =
        payload.quantity;
      break;

    default:
      throw new Error(
        "Invalid transaction type",
      );
  }

  const { error: updateError } =
    await supabase
      .from("batches")
      .update({
        quantity: newQuantity,
      })
      .eq(
        "id",
        currentBatch.id,
      );

  if (updateError) {
    throw updateError;
  }

  const transactionNotes =
    payload.transaction_type ===
      "ADJUSTMENT"
      ? `Adjusted from ${currentBatch.quantity} to ${newQuantity}`
      : payload.notes ?? null;

  const {
    error: transactionError,
  } = await supabase
    .from(
      "inventory_transactions",
    )
    .insert({
      batch_id:
        currentBatch.id,

      product_id:
        currentBatch.product_id,

      transaction_type:
        payload.transaction_type,

      quantity:
        payload.quantity,

      notes:
        transactionNotes,
    });

  if (transactionError) {
    throw transactionError;
  }

  return true;
}