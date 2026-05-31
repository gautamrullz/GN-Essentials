import {
  LayoutDashboard,
  Package,
  Users,
  FolderTree,
  Boxes,
  ClipboardList,
  BarChart3,
  ArrowLeftRight,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
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
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: FolderTree,
      },
      {
        title: "Sub Categories",
        href: "/dashboard/sub-categories",
        icon: FolderTree,
      },
      {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
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
      },
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: ClipboardList,
      },
      {
        title: "Stock Movement",
        href: "/dashboard/stock-movement",
        icon: ArrowLeftRight,
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
      },
    ],
  },
];
