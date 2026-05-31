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

import {
  subCategorySchema,
  SubCategoryFormValues,
} from "@/lib/validations/sub-category";

import { Category } from "@/types/category";
import { SubCategory } from "@/types/sub-category";

interface SubCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subCategory?: SubCategory;
  categories: Category[];
  onSubmit: (
    values: SubCategoryFormValues
  ) => Promise<void>;
}

export function SubCategoryModal({
  open,
  onOpenChange,
  subCategory,
  categories,
  onSubmit,
}: SubCategoryModalProps) {
  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
    defaultValues: {
      category_id: "",
      name: "",
    },
  });

  useEffect(() => {
    if (subCategory) {
      form.reset({
        category_id: subCategory.category_id,
        name: subCategory.name,
      });
    } else {
      form.reset({
        category_id: "",
        name: "",
      });
    }
  }, [subCategory, form]);

  const handleSubmit = async (
    values: SubCategoryFormValues
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
            {subCategory
              ? "Edit Sub Category"
              : "Add Sub Category"}
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
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={
                      field.onChange
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map(
                        (category) => (
                          <SelectItem
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sub Category Name
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Sub Category Name"
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
                {subCategory
                  ? "Update Sub Category"
                  : "Create Sub Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}