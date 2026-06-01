"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getDashboardMetrics } from "@/lib/services/dashboard";

interface DashboardMetrics {
  totalProducts: number;
  totalBatches: number;
  totalStock: number;
  inventoryValue: number;
  lowStockProducts: number;
  expiringSoon: number;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProducts: 0,
    totalBatches: 0,
    totalStock: 0,
    inventoryValue: 0,
    lowStockProducts: 0,
    expiringSoon: 0,
  });

  useEffect(() => {
    async function loadData() {
      const data = await getDashboardMetrics();

      setMetrics(data);
    }

    void loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground mt-2">
          GN Essentials Inventory Management System
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/dashboard/products"
          className="rounded-lg border p-6 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <h3 className="text-sm text-muted-foreground">Total Products</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.totalProducts}</p>
        </Link>

        <Link
          href="/dashboard/batches"
          className="rounded-lg border p-6 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <h3 className="text-sm text-muted-foreground">Total Batches</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.totalBatches}</p>
        </Link>

        <Link
          href="/dashboard/products"
          className="rounded-lg border p-6 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <h3 className="text-sm text-muted-foreground">Total Stock</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.totalStock}</p>
        </Link>

        <Link
          href="/dashboard/reports"
          className="rounded-lg border p-6 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <h3 className="text-sm text-muted-foreground">Inventory Value</h3>

          <p className="mt-2 text-3xl font-bold">
            ₹{metrics.inventoryValue.toFixed(2)}
          </p>
        </Link>

        <Link
          href="/dashboard/alerts/low-stock"
          className="rounded-lg border p-6 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <h3 className="text-sm text-muted-foreground">Low Stock Products</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.lowStockProducts}</p>
        </Link>

        <Link
          href="/dashboard/alerts/expiring-soon"
          className="rounded-lg border p-6 transition-all hover:bg-muted/50 hover:shadow-sm"
        >
          <h3 className="text-sm text-muted-foreground">Expiring Soon</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.expiringSoon}</p>
        </Link>
      </div>
    </div>
  );
}
