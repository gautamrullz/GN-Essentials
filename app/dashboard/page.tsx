"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getDashboardMetrics } from "@/lib/services/dashboard";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Clock3,
  IndianRupee,
  Package,
} from "lucide-react";
import { MetricCard } from "./metric-card";
import { QuickActions } from "./quick-actions";

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
        <h1 className="text-3xl font-bold md:text-4xl">Dashboard</h1>
        <QuickActions />
        <p className="text-muted-foreground mt-2">
          GN Essentials Inventory Management System
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Inventory Value"
          value={`₹${metrics.inventoryValue.toFixed(2)}`}
          href="/dashboard/reports"
          icon={IndianRupee}
          variant="hero"
        />

        <MetricCard
          title="Low Stock Products"
          value={metrics.lowStockProducts}
          href="/dashboard/alerts/low-stock"
          icon={AlertTriangle}
          variant="warning"
        />

        <MetricCard
          title="Expiring Soon"
          value={metrics.expiringSoon}
          href="/dashboard/alerts/expiry"
          icon={Clock3}
          variant="danger"
        />

        <MetricCard
          title="Total Products"
          value={metrics.totalProducts}
          href="/dashboard/products"
          icon={Package}
        />

        <MetricCard
          title="Total Batches"
          value={metrics.totalBatches}
          href="/dashboard/batches"
          icon={Boxes}
        />

        <MetricCard
          title="Total Stock"
          value={metrics.totalStock}
          href="/dashboard/products"
          icon={BarChart3}
        />
      </div>
    </div>
  );
}
