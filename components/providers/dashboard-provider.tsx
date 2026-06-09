"use client";

import { AuthGuard } from "../auth/auth-guard";
import { AuthProvider } from "./auth-provider";

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  );
}
