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
  categorySchema,
  CategoryFormValues,
} from "@/lib/validations/category";

import { Category } from "@/types/category";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSubmit: (
    values: CategoryFormValues
  ) => Promise<void>;
}

export function CategoryModal({
  open,
  onOpenChange,
  category,
  onSubmit,
}: CategoryModalProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [category, form]);

  const handleSubmit = async (
    values: CategoryFormValues
  ) => {
    await onSubmit(values);

    form.reset();

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {category
              ? "Edit Category"
              : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(false)
                }
              >
                Cancel
              </Button>

              <Button type="submit">
                {category
                  ? "Update Category"
                  : "Create Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}