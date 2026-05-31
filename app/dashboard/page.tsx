"use client";

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
        <div className="rounded-lg border p-6">
          <h3 className="text-sm text-muted-foreground">Total Products</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.totalProducts}</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm text-muted-foreground">Total Batches</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.totalBatches}</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm text-muted-foreground">Total Stock</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.totalStock}</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm text-muted-foreground">Inventory Value</h3>

          <p className="mt-2 text-3xl font-bold">
            ₹{metrics.inventoryValue.toFixed(2)}
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm text-muted-foreground">Low Stock Products</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.lowStockProducts}</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-sm text-muted-foreground">Expiring Soon</h3>

          <p className="mt-2 text-3xl font-bold">{metrics.expiringSoon}</p>
        </div>
      </div>
    </div>
  );
}
