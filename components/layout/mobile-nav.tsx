"use client";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { AppSidebar } from "./app-sidebar";

export function MobileNav() {
  return (
    <div className="border-b bg-background md:hidden">
      <div className="flex h-14 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="rounded-md p-2 hover:bg-muted"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>

          <SheetContent side="left" className="w-[85vw] max-w-[320px] p-0">
            <div className="sr-only">
              <h2>Navigation Menu</h2>
              <p>Main application navigation</p>
            </div>

            <AppSidebar />
          </SheetContent>
        </Sheet>

        <h1 className="ml-3 font-semibold">GN Essentials</h1>
      </div>
    </div>
  );
}
