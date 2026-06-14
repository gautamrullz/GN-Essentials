"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";
import { DashboardSkeleton } from "../layout/dashboard-skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { initialized, isAuthenticated } = useAuth();

  console.log("AUTH GUARD", {
    initialized,
    isAuthenticated,
  });

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        Redirecting...
      </div>
    );
  }

  return <>{children}</>;
}
