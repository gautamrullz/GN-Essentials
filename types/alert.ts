export interface LowStockProduct {
  id: string;
  name: string;
  low_stock_limit: number;
  current_stock: number;
}

export interface ExpiringBatch {
  id: string;
  batch_number: string;
  expiry_date: string;

  products: {
    id: string;
    name: string;
  }[];
}