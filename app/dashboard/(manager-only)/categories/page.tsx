"use client";

import { useEffect, useState } from "react";

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

import { CategoryModal } from "@/components/categories/category-modal";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categories";

import { Category } from "@/types/category";

import { CategoryFormValues } from "@/lib/validations/category";

import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadCategories() {
    const data = await getCategories();

    setCategories(data ?? []);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadCategories();
    };

    void fetchData();
  }, []);

  async function handleSubmit(values: CategoryFormValues) {
    console.log("PAGE HANDLE SUBMIT", values);
    try {
      if (selectedCategory) {
        await updateCategory({
          id: selectedCategory.id,
          ...values,
        });

        toast.success("Category updated successfully");
      } else {
        await createCategory(values);

        toast.success("Category created successfully");
      }

      await loadCategories();

      setSelectedCategory(undefined);
    } catch (error) {
      console.error(error);

      toast.error("Failed to save category");
    }
  }

  async function handleDelete(category: Category) {
    const confirmed = window.confirm(`Delete ${category.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);

      await deleteCategory(category.id);

      toast.success("Category deleted successfully");

      await loadCategories();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  }

  function handleAddCategory() {
    setSelectedCategory(undefined);

    setOpen(true);
  }

  function handleEditCategory(category: Category) {
    setSelectedCategory(category);

    setOpen(true);
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage product categories"
        action={
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {categories.length} Categories
            </div>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </div>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState title="No categories found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditCategory(category)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === category.id}
                        onClick={() => handleDelete(category)}
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

      <CategoryModal
        open={open}
        onOpenChange={setOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
      />
    </>
  );
}
