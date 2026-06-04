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

export default function LowStockPage() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);

  async function loadData() {
    const data = await getLowStockProducts();

    setProducts(data);
  }

  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, []);

  return (
    <>
      <PageHeader
        title="Low Stock Alerts"
        description="Products below their stock threshold"
      />

      <div className="rounded-md border">
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
  );
}
