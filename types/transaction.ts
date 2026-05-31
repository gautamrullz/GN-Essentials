export interface InventoryTransaction {
  id: string;
  batch_id: string;
  product_id: string;
  transaction_type: string;
  quantity: number;
  notes: string | null;
  created_at: string;
}

export interface InventoryTransactionWithRelations extends InventoryTransaction {
  products: {
    id: string;
    name: string;
  } | null;

  batches: {
    id: string;
    batch_number: string;
  } | null;
}
