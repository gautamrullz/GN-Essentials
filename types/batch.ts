export interface Batch {
  id: string;
  product_id: string;
  supplier_id: string;
  batch_number: string;
  purchase_date: string;
  expiry_date: string;
  quantity: number;
  status: "ACTIVE" | "INACTIVE";
  created_at: string;
}

export interface BatchWithRelations extends Batch {
  products: {
    id: string;
    name: string;
    purchase_price: number;
  } | null;

  suppliers: {
    id: string;
    name: string;
  } | null;
}

export type CreateBatchInput = {
  product_id: string;
  supplier_id: string;
  purchase_date: string;
  expiry_date: string;
  quantity: number;
};

export type UpdateBatchInput = CreateBatchInput & {
  id: string;
};

export interface BatchDetails extends Batch {
  products?: {
    id: string;
    name: string;
    purchase_price: number;
    selling_price: number;
  } | null;
}
