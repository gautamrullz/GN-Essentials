export interface InventoryValuationRow {
  product_name: string;
  batch_number: string;
  quantity: number;
  purchase_price: number;
  inventory_value: number;
}

export interface StockReportRow {
  product_name: string;
  current_stock: number;
  low_stock_limit: number;
  status: "NORMAL" | "LOW STOCK";
}

export interface ExpiryReportRow {
  product_name: string;
  batch_number: string;
  expiry_date: string;
  days_left: number;
}
