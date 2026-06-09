"use client";

import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { getAllowedRoles } from "@/lib/auth/permissions";

import { useAuth } from "@/components/providers/auth-provider";

type RouteGuardProps = {
  children: React.ReactNode;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();

  const pathname = usePathname();

  const { role, initialized } = useAuth();

  const allowedRoles = getAllowedRoles(pathname);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!allowedRoles) {
      return;
    }

    if (!role) {
      router.replace("/dashboard");

      return;
    }

    if (!allowedRoles.includes(role)) {
      router.replace("/dashboard");
    }
  }, [allowedRoles, initialized, role, router]);

  if (!initialized) {
    return null;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}