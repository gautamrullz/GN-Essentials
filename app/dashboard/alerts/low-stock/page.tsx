"use client";

import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getLowStockProducts } from "@/lib/services/alerts";

import { LowStockProduct } from "@/types/alert";
import { SharedSkeleton } from "@/components/shared/table-skeleton";

export default function LowStockPage() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  async function loadData() {
    setPageLoading(true);
    const data = await getLowStockProducts();

    setProducts(data);
    setPageLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  if (pageLoading) {
    return <SharedSkeleton />;
  }

  return (
    <>
      <PageHeader
        title="Low Stock Alerts"
        description="Products below their stock threshold"
      />

      <>
        {/* Mobile Cards */}
        <div className="space-y-2 md:hidden">
          {products.length === 0 ? (
            <div className="rounded-lg border bg-card p-4 text-center text-muted-foreground">
              No low stock products
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="rounded-lg border bg-card p-4">
                <div className="mb-2">
                  <p className="wrap-break-words font-medium">{product.name}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Stock</span>

                    <span className="font-semibold text-red-500">
                      {product.current_stock}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Low Stock Limit
                    </span>

                    <span>{product.low_stock_limit}</span>
                  </div>
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
                <TableHead>Product</TableHead>

                <TableHead>Current Stock</TableHead>

                <TableHead>Low Stock Limit</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No low stock products
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>

                    <TableCell>{product.current_stock}</TableCell>

                    <TableCell>{product.low_stock_limit}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </>
    </>
  );
}
