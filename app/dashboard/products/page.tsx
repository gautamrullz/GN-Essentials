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
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {products.length} Products
            </div>

            <Button
              onClick={() => {
                setSelectedProduct(undefined);

                setOpen(true);
              }}
            >
              Add Product
            </Button>
          </div>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>

              <TableHead className="hidden md:table-cell">Brand</TableHead>

              <TableHead className="hidden lg:table-cell">Category</TableHead>

              <TableHead className="hidden lg:table-cell">
                Sub Category
              </TableHead>

              <TableHead>Stock</TableHead>

              <TableHead className="hidden md:table-cell">Unit</TableHead>

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
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground md:hidden">
                        {product.brand}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {product.brand}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.categories?.name}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {product.sub_categories?.name}
                  </TableCell>

                  <TableCell>
                    <span
                      className={
                        product.current_stock <= product.low_stock_limit
                          ? "font-semibold text-red-500"
                          : ""
                      }
                    >
                      {product.current_stock}
                    </span>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">
                    {product.unit_type}
                  </TableCell>

                  <TableCell>
                    <StatusBadge status={product.status} />
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1 md:flex-row">
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
