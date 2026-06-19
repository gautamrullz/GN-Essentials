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
import { SharedSkeleton } from "@/components/shared/table-skeleton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [pageLoading, setPageLoading] = useState(true);

  async function loadCategories() {
    setPageLoading(true);
    const data = await getCategories();

    setCategories(data ?? []);
    setPageLoading(false);
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

  if (pageLoading) {
    return <SharedSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="Categories"
        description="Manage product categories"
        action={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

      <>
        {/* Mobile Cards */}
        <div className="space-y-3 md:hidden">
          {filteredCategories.length === 0 ? (
            <EmptyState title="No categories found" />
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="rounded-lg border bg-card p-3">
                <div className="mb-2">
                  <p className="font-medium wrap-break-words">{category.name}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEditCategory(category)}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    disabled={deletingId === category.id}
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden rounded-md border md:block">
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
      </>

      <CategoryModal
        open={open}
        onOpenChange={setOpen}
        category={selectedCategory}
        onSubmit={handleSubmit}
      />
    </>
  );
}
