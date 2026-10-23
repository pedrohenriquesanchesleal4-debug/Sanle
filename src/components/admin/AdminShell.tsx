"use client";

import type { Session } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export function AdminShell({
  session,
  children
}: {
  session: Session;
  children: React.ReactNode;
}) {
  return <DashboardShell session={session}>{children}</DashboardShell>;
}
