export const TRANSACTION_TYPES = [
  "SALE",
  "RETURN",
  "DAMAGE",
  "WASTAGE",
  "ADJUSTMENT",
] as const;

export type TransactionType =
  (typeof TRANSACTION_TYPES)[number];

export interface StockMovementInput {
  batch_id: string;
  transaction_type: TransactionType;
  quantity: number;
  notes?: string;
}