import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { DashboardProvider } from "@/components/providers/dashboard-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex h-screen">
        <div className="hidden w-64 border-r md:block">
          <AppSidebar />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <MobileNav />

          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
