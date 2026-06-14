"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { LogOut, Package } from "lucide-react";

import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Button } from "../ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading } = useAuth();
  async function handleLogout() {
    await supabase.auth.signOut();

    router.replace("/login");
  }

  if (loading || !profile) {
    return (
      <aside className="flex h-full w-full flex-col bg-background">
        <div className="border-b p-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />

            <span className="text-lg font-bold">GN Essentials</span>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            Inventory Management
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-full flex-col bg-background">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />

          <span className="text-lg font-bold">GN Essentials</span>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          Inventory Management
        </p>
      </div>

      <nav className="mt-2 flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {navigation.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.roles.includes(profile.role),
          );

          if (visibleItems.length === 0) {
            return null;
          }

          return (
            <div key={section.title}>
              <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.title}
              </p>

              <div className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted/70",
                      )}
                    >
                      <Icon className="h-4 w-4" />

                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="font-medium">{profile.full_name ?? "Unknown User"}</div>

        <div className="text-xs text-muted-foreground">{profile.role}</div>

        <Button
          variant="destructive"
          size="sm"
          className="mt-3 w-full"
          onClick={() => {
            void handleLogout();
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>

        <div className="mt-2 text-xs text-muted-foreground">
          GN Essentials v1.5
        </div>
      </div>
    </aside>
  );
}
