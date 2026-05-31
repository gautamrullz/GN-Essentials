export interface SubCategory {
  id: string;
  category_id: string;
  name: string;
  created_at: string;
}

export interface SubCategoryWithCategory
  extends SubCategory {
  categories: {
    id: string;
    name: string;
  } | null;
}

export type CreateSubCategoryInput = {
  category_id: string;
  name: string;
};

export type UpdateSubCategoryInput = {
  id: string;
  category_id: string;
  name: string;
};