export interface Batch {
  id: string;
  product_id: string;
  supplier_id: string;
  batch_number: string;
  manufacture_date: string;
  purchase_date: string;
  expiry_date: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  status: string;
  created_at: string;
}

export interface BatchWithRelations
  extends Batch {
  products: {
    id: string;
    name: string;
  } | null;

  suppliers: {
    id: string;
    name: string;
  } | null;
}

export type CreateBatchInput = {
  product_id: string;
  supplier_id: string;
  batch_number: string;
  manufacture_date: string;
  purchase_date: string;
  expiry_date: string;
  quantity: number;
  purchase_price: number;
  selling_price: number;
  status: string;
};

export type UpdateBatchInput =
  CreateBatchInput & {
    id: string;
  };