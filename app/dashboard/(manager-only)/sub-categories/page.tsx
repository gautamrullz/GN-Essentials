"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/crud/empty-state";

import { SubCategoryModal } from "@/components/sub-categories/sub-category-modal";

import {
  getSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "@/lib/services/sub-categories";

import { getCategories } from "@/lib/services/categories";

import { Category } from "@/types/category";
import { SubCategory, SubCategoryWithCategory } from "@/types/sub-category";

import { SubCategoryFormValues } from "@/lib/validations/sub-category";

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<SubCategoryWithCategory[]>(
    [],
  );

  const [categories, setCategories] = useState<Category[]>([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory>();

  async function loadData() {
    const [subCategoryData, categoryData] = await Promise.all([
      getSubCategories(),
      getCategories(),
    ]);

    setSubCategories(subCategoryData ?? []);

    setCategories(categoryData ?? []);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  async function handleSubmit(values: SubCategoryFormValues) {
    try {
      if (selectedSubCategory) {
        await updateSubCategory({
          id: selectedSubCategory.id,
          ...values,
        });

        toast.success("Sub Category updated successfully");
      } else {
        await createSubCategory(values);

        toast.success("Sub Category created successfully");
      }

      await loadData();

      setSelectedSubCategory(undefined);
    } catch {
      toast.error("Failed to save Sub Category");
    }
  }

  async function handleDelete(subCategory: SubCategory) {
    const confirmed = window.confirm(`Delete ${subCategory.name}?`);

    if (!confirmed) return;

    await deleteSubCategory(subCategory.id);

    toast.success("Sub Category deleted successfully");

    await loadData();
  }

  const filteredSubCategories = subCategories.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.categories?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Sub Categories"
        description="Manage sub categories"
        action={
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {subCategories.length} Sub Categories
            </div>
            <Button
              onClick={() => {
                setSelectedSubCategory(undefined);
                setOpen(true);
              }}
            >
              Add Sub Category
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>

              <TableHead>Sub Category</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredSubCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <EmptyState title="No sub categories found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredSubCategories.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.categories?.name}</TableCell>

                  <TableCell>{item.name}</TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedSubCategory(item);
                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SubCategoryModal
        open={open}
        onOpenChange={setOpen}
        subCategory={selectedSubCategory}
        categories={categories}
        onSubmit={handleSubmit}
      />
    </>
  );
}
