"use client";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import { createBatch } from "@/lib/services/batches";

import { Product } from "@/types/product";
import { Supplier } from "@/types/supplier";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LoadingButton } from "@/components/ui/loading-button";

interface DailyBatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  suppliers: Supplier[];
  onBatchAdded: () => Promise<void>;
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function DailyBatchModal({
  open,
  onOpenChange,
  products,
  suppliers,
  onBatchAdded,
}: DailyBatchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [supplierId, setSupplierId] = useState("");

  const [expiryDate, setExpiryDate] = useState(getTodayDate());

  const [quantity, setQuantity] = useState<number>(0);

  const [saving, setSaving] = useState(false);

  const fastMovingProducts = useMemo(
    () =>
      products.filter((product) => product.inventory_type === "FAST_MOVING"),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return fastMovingProducts;
    }

    return fastMovingProducts.filter((product) =>
      product.name.toLowerCase().includes(term),
    );
  }, [fastMovingProducts, searchTerm]);

  async function handleAddBatch() {
    try {
      if (!selectedProduct) {
        toast.error("Please select a product");

        return;
      }

      if (!supplierId) {
        toast.error("Please select a supplier");

        return;
      }

      if (!expiryDate) {
        toast.error("Please select an expiry date");

        return;
      }

      if (quantity <= 0) {
        toast.error("Quantity must be greater than zero");

        return;
      }

      setSaving(true);

      await createBatch({
        product_id: selectedProduct.id,
        supplier_id: supplierId,
        purchase_date: getTodayDate(),
        expiry_date: expiryDate,
        quantity,
      });

      toast.success("Batch added successfully");

      await onBatchAdded();

      // Reset form
      setSearchTerm("");
      setSelectedProduct(null);
      setSupplierId("");
      setExpiryDate(getTodayDate());
      setQuantity(0);

      // Close modal
      onOpenChange(false);
    } catch (error) {
      console.error(error);

      toast.error("Failed to add batch");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Daily Restock</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Search Product
              </label>

              <Input
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {searchTerm.trim() && (
              <div className="max-h-64 overflow-y-auto rounded-md border">
                {filteredProducts.length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">
                    No matching products found
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => {
                        setSelectedProduct(product);

                        setSearchTerm("");
                      }}
                      className="w-full border-b p-3 text-left transition-colors hover:bg-muted last:border-b-0"
                    >
                      <div className="font-medium">{product.name}</div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        Stock: {product.current_stock}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Selected Product
              </label>

              <Input
                value={selectedProduct?.name ?? ""}
                placeholder="Search and select a product"
                disabled
              />
            </div>
          </div>

          <div>
            {!selectedProduct ? (
              <p className="text-muted-foreground">
                Search and select a fast moving product
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product</span>

                  <span className="font-medium">{selectedProduct.name}</span>
                </div>

                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground">Current Stock</p>

                  <p className="text-3xl font-bold">
                    {selectedProduct.current_stock}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Supplier
                  </label>

                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Supplier" />
                    </SelectTrigger>

                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Expiry Date
                  </label>

                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Quantity
                  </label>

                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                <LoadingButton
                  onClick={handleAddBatch}
                  loading={saving}
                  loadingText="Adding Batch..."
                  className="w-full"
                >
                  Add Batch
                </LoadingButton>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
