"use client";

import { MaintenancePage } from "@/components/maintenance-page";

interface ClientLayoutProps {
  children: React.ReactNode;
}

// MAINTENANCE MODE: Set to false to restore the site
const MAINTENANCE_MODE = true;

export function ClientLayout({ children }: ClientLayoutProps) {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}
