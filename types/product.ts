export interface Product {
  id: string;
  name: string;
  brand: string | null;
  category_id: string;
  sub_category_id: string;
  unit_type: string;
  image_url: string | null;
  low_stock_limit: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductWithRelations
  extends Product {
  categories: {
    id: string;
    name: string;
  } | null;

  sub_categories: {
    id: string;
    name: string;
  } | null;
}

export type CreateProductInput = {
  name: string;
  brand?: string;
  category_id: string;
  sub_category_id: string;
  unit_type: string;
  low_stock_limit: number;
  status: string;
};

export type UpdateProductInput = {
  id: string;
  name: string;
  brand?: string;
  category_id: string;
  sub_category_id: string;
  unit_type: string;
  low_stock_limit: number;
  status: string;
};

export const UNIT_TYPES = [
  "PCS",
  "PACKET",
  "BOX",
  "BOTTLE",
  "KG",
  "GRAM",
  "LITRE",
  "ML",
] as const;