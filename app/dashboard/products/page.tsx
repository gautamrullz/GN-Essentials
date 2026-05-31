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

import { PageHeader } from "@/components/crud/page-header";
import { EmptyState } from "@/components/crud/empty-state";
import { StatusBadge } from "@/components/crud/status-badge";

import { ProductModal } from "@/components/products/product-modal";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/services/products";

import { getCategories } from "@/lib/services/categories";
import { getSubCategories } from "@/lib/services/sub-categories";

import { Category } from "@/types/category";

import { Product, ProductWithRelations } from "@/types/product";

import { SubCategory } from "@/types/sub-category";

import { ProductFormValues } from "@/lib/validations/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product>();

  async function loadData() {
    const [productData, categoryData, subCategoryData] = await Promise.all([
      getProducts(),
      getCategories(),
      getSubCategories(),
    ]);

    setProducts(productData ?? []);

    setCategories(categoryData ?? []);

    setSubCategories((subCategoryData ?? []) as SubCategory[]);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  async function handleSubmit(values: ProductFormValues) {
    try {
      if (selectedProduct) {
        await updateProduct({
          id: selectedProduct.id,
          ...values,
        });

        toast.success("Product updated successfully");
      } else {
        await createProduct(values);

        toast.success("Product created successfully");
      }

      await loadData();

      setSelectedProduct(undefined);
    } catch (error) {
      console.error(error);

      toast.error("Failed to save product");
    }
  }

  async function handleDelete(product: Product) {
    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(product.id);

      await deleteProduct(product.id);

      toast.success("Product deleted successfully");

      await loadData();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(searchValue) ||
      product.brand?.toLowerCase().includes(searchValue) ||
      product.categories?.name?.toLowerCase().includes(searchValue) ||
      product.sub_categories?.name?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage products"
        action={
          <Button
            onClick={() => {
              setSelectedProduct(undefined);

              setOpen(true);
            }}
          >
            Add Product
          </Button>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead>Brand</TableHead>

              <TableHead>Category</TableHead>

              <TableHead>Sub Category</TableHead>

              <TableHead>Unit</TableHead>

              <TableHead>Status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyState title="No products found" />
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>

                  <TableCell>{product.brand}</TableCell>

                  <TableCell>{product.categories?.name}</TableCell>

                  <TableCell>{product.sub_categories?.name}</TableCell>

                  <TableCell>{product.unit_type}</TableCell>

                  <TableCell>
                    <StatusBadge status={product.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedProduct(product);

                          setOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deletingId === product.id}
                        onClick={() => handleDelete(product)}
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

      <ProductModal
        open={open}
        onOpenChange={setOpen}
        product={selectedProduct}
        categories={categories}
        subCategories={subCategories}
        onSubmit={handleSubmit}
      />
    </>
  );
}
