import Link from "next/link";

import { AlertTriangle, ArrowLeftRight, Boxes, Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    title: "Add Batch",
    href: "/dashboard/batches",
    icon: Boxes,
  },
  {
    title: "Stock Movement",
    href: "/dashboard/stock-movement",
    icon: ArrowLeftRight,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Low Stock",
    href: "/dashboard/alerts/low-stock",
    icon: AlertTriangle,
  },
];

export function QuickActions() {
  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.href} href={action.href}>
              <Card className="cursor-pointer transition-all hover:shadow-md hover:bg-muted/50">
                <CardContent>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">{action.title}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
