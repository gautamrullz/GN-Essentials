import { Role } from "@/types/role";

export const permissions: Record<Role, string[]> = {
  STAFF: [
    "/dashboard",
    "/dashboard/batches",
    "/dashboard/transactions",
    "/dashboard/stock-movement",
    "/dashboard/alerts/low-stock",
    "/dashboard/alerts/expiry",
  ],

  MANAGER: [
    "/dashboard",
    "/dashboard/suppliers",
    "/dashboard/categories",
    "/dashboard/sub-categories",
    "/dashboard/products",
    "/dashboard/batches",
    "/dashboard/transactions",
    "/dashboard/stock-movement",
    "/dashboard/alerts/low-stock",
    "/dashboard/alerts/expiry",
    "/dashboard/reports",
  ],

  OWNER: ["*"],
};