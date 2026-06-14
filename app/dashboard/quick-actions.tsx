"use client";

import Link from "next/link";

import { AlertTriangle, ArrowLeftRight, Boxes, Package } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/components/providers/auth-provider";

import { Role } from "@/types/role";

type QuickAction = {
  title: string;
  href: string;
  icon: typeof Boxes;
  roles: Role[];
};

const actions: QuickAction[] = [
  {
    title: "Add Batch",
    href: "/dashboard/batches",
    icon: Boxes,
    roles: ["OWNER", "MANAGER", "STAFF"],
  },
  {
    title: "Stock Movement",
    href: "/dashboard/stock-movement",
    icon: ArrowLeftRight,
    roles: ["OWNER", "MANAGER", "STAFF"],
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
    roles: ["OWNER", "MANAGER"],
  },
  {
    title: "Low Stock",
    href: "/dashboard/alerts/low-stock",
    icon: AlertTriangle,
    roles: ["OWNER", "MANAGER", "STAFF"],
  },
];

export function QuickActions() {
  const { role } = useAuth();

  const visibleActions = actions.filter(
    (action) => role && action.roles.includes(role),
  );

  return (
    <div>
      <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleActions.map((action) => {
          const Icon = action.icon;

          return (
            <Link key={action.href} href={action.href} prefetch={false}>
              <Card className="cursor-pointer transition-all hover:bg-muted/50 hover:shadow-md">
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
