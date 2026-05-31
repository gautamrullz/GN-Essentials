// types/supplier.ts

export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  gst_number: string | null;
  address: string | null;
  status: string;
  created_at: string;
}

export type CreateSupplierInput = {
  name: string;
  phone?: string;
  gst_number?: string;
  address?: string;
  status?: string;
};

export type UpdateSupplierInput = CreateSupplierInput & {
  id: string;
};
