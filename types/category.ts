export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export type CreateCategoryInput = {
  name: string;
};

export type UpdateCategoryInput = {
  id: string;
  name: string;
};