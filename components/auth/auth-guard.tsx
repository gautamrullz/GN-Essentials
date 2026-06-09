"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/auth-provider";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    initialized,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [
    initialized,
    isAuthenticated,
    router,
  ]);

  if (!initialized) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}