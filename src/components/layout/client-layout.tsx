"use client";

import { usePathname } from "next/navigation";
import { SplashScreen, CookieBanner } from "@/components/ui";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <>
      {isHomePage && <SplashScreen />}
      {children}
      <CookieBanner />
    </>
  );
}
