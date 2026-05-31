"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-6">
        <h2 className="font-bold text-xl">
          GN Essentials
        </h2>
      </div>

      <nav className="space-y-6 px-3">
        {navigation.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}