import { RouteGuard } from "@/components/auth/role-guard";

export default function ManagerOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RouteGuard>{children}</RouteGuard>;
}