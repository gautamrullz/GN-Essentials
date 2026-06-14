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

interface BatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  batch?: Batch;
  products: Product[];
  suppliers: Supplier[];
  onSubmit: (values: BatchFormValues) => Promise<void>;
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
      batch_number: "",
      purchase_date: "",
      expiry_date: "",
      quantity: 0,
      status: "ACTIVE",
    },
  });
  const selectedProduct = products.find(
    (product) => product.id === form.watch("product_id"),
  );

  useEffect(() => {
    if (batch) {
      form.reset({
        product_id: batch.product_id,
        supplier_id: batch.supplier_id,
        batch_number: batch.batch_number,
        purchase_date: batch.purchase_date,
        expiry_date: batch.expiry_date,
        quantity: batch.quantity,
        status: batch.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
      });
    } else {
      form.reset({
        product_id: "",
        supplier_id: "",
        batch_number: "",
        purchase_date: "",
        expiry_date: "",
        quantity: 0,
        status: "ACTIVE",
      });
    }
  }, [batch, form]);

  async function handleSave(values: BatchFormValues) {
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
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ( ₹{product.selling_price} | ₹
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select Supplier" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
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

            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Number</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>

                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit">Save Batch</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
