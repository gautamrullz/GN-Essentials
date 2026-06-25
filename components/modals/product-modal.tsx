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

import { productSchema, ProductFormValues } from "@/lib/validations/product";

import { Product, UNIT_TYPES } from "@/types/product";

import { Category } from "@/types/category";
import { LoadingButton } from "../ui/loading-button";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  product?: Product;

  categories: Category[];

  onSubmit: (values: ProductFormValues) => Promise<void>;
}

export function ProductModal({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
}: ProductModalProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      brand: "",
      category_id: "",
      sub_category_id: null,
      unit_type: "",
      low_stock_limit: 0,
      purchase_price: 0,
      selling_price: 0,
      status: "ACTIVE",
      inventory_type: "STANDARD",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        brand: product.brand ?? "",
        category_id: product.category_id,
        sub_category_id: product.sub_category_id ?? null,
        unit_type: product.unit_type,
        low_stock_limit: product.low_stock_limit,
        purchase_price: product.purchase_price,
        selling_price: product.selling_price,
        status: product.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
        inventory_type: product.inventory_type,
      });
    } else {
      form.reset({
        name: "",
        brand: "",
        category_id: "",
        sub_category_id: null,
        unit_type: "",
        low_stock_limit: 0,
        purchase_price: 0,
        selling_price: 0,
        status: "ACTIVE",
        inventory_type: "STANDARD",
      });
    }
  }, [product, form]);

  const handleSubmit = async (values: ProductFormValues) => {
    await onSubmit(values);

    form.reset();

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Product Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>

                    <FormControl>
                      <Input placeholder="Brand" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="inventory_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inventory Type</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Unit Type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="STANDARD">
                          Standard
                        </SelectItem>

                        <SelectItem value="FAST_MOVING">
                          Fast Moving
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>

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
                name="selling_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>

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
                name="unit_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Type</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Unit Type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {UNIT_TYPES.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
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
                name="low_stock_limit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Low Stock Limit</FormLabel>

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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>

                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
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
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t bg-background pt-4 md:flex-row md:justify-end">
              <Button
                className="w-full md:w-auto"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>

              <LoadingButton
                className="w-full md:w-auto"
                type="submit"
                loading={form.formState.isSubmitting}
                loadingText={
                  product ? "Updating Product..." : "Creating Product..."
                }
              >
                {product ? "Update Product" : "Create Product"}
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
