import {
  LayoutDashboard,
  Package,
  Users,
  FolderTree,
  Boxes,
  ClipboardList,
  BarChart3,
  ArrowLeftRight,
  TriangleAlert,
} from "lucide-react";

import { Role } from "@/types/role";

export type NavigationItem = {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};

export const navigation: NavigationSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
    ],
  },

  {
    title: "Master Data",
    items: [
      {
        title: "Suppliers",
        href: "/dashboard/suppliers",
        icon: Users,
        roles: ["OWNER", "MANAGER"],
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: FolderTree,
        roles: ["OWNER", "MANAGER"],
      },
      {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
        roles: ["OWNER", "MANAGER"],
      },
    ],
  },

  {
    title: "Inventory",
    items: [
      {
        title: "Batches",
        href: "/dashboard/batches",
        icon: Boxes,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: ClipboardList,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
      {
        title: "Stock Movement",
        href: "/dashboard/stock-movement",
        icon: ArrowLeftRight,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
    ],
  },

  {
    title: "Alerts",
    items: [
      {
        title: "Low Stock",
        href: "/dashboard/alerts/low-stock",
        icon: TriangleAlert,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
      {
        title: "Expiry",
        href: "/dashboard/alerts/expiry",
        icon: TriangleAlert,
        roles: ["OWNER", "MANAGER", "STAFF"],
      },
    ],
  },

  {
    title: "Reports",
    items: [
      {
        title: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
        roles: ["OWNER", "MANAGER"],
      },
    ],
  },
];