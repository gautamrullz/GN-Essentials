"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BatchFormValues, batchSchema } from "@/lib/validations/batch";

import { Batch } from "@/types/batch";
import { Product } from "@/types/product";
import { Supplier } from "@/types/supplier";
import { LoadingButton } from "../ui/loading-button";

interface BatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch?: Batch;
  products: Product[];
  suppliers: Supplier[];
  onSubmit: (values: BatchFormValues) => Promise<void>;
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function BatchModal({
  open,
  onOpenChange,
  batch,
  products,
  suppliers,
  onSubmit,
}: BatchModalProps) {
  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      product_id: "",
      supplier_id: "",
      purchase_date: getTodayDate(),
      expiry_date: "",
      quantity: 0,
    },
  });
  const selectedProduct = products.find(
    (product) => product.id === form.watch("product_id"),
  );

  console.log(form.formState.errors);

  useEffect(() => {
    if (batch) {
      form.reset({
        product_id: batch.product_id,
        supplier_id: batch.supplier_id,
        purchase_date: batch.purchase_date,
        expiry_date: batch.expiry_date,
        quantity: batch.quantity,
      });
    } else {
      form.reset({
        product_id: "",
        supplier_id: "",

        purchase_date: getTodayDate(),
        expiry_date: "",
        quantity: 0,
      });
    }
  }, [batch, form]);

  async function handleSave(values: BatchFormValues) {
    console.log("Submitting batch:", values);
    await onSubmit(values);

    form.reset();

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{batch ? "Edit Batch" : "Add Batch"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {products.map((product, index) => (
                          <SelectItem key={product.id} value={product.id}>
                            {String(index + 1).padStart(3, "0")} -{" "}
                            {product.name} (₹
                            {product.purchase_price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent className="max-h-60 overflow-y-auto">
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedProduct && (
              <div className="rounded-md border bg-muted/50 p-3 text-sm">
                <div>Purchase Price: ₹{selectedProduct.purchase_price}</div>

                <div>Selling Price: ₹{selectedProduct.selling_price}</div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Date</FormLabel>

                    <Input type="date" {...field} />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>

                    <Input type="date" {...field} />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                loadingText="Saving Batch..."
              >
                Save Batch
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
