import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { OffMarketContent } from "./off-market-content";

export const metadata: Metadata = {
  title: "Off-Market - Ophir Estate",
  description: "Accès aux transactions patrimoniales discrètes : successions, arbitrages, opérations familiales et repositionnement hors marché public.",
};

export default function OffMarketPage() {
  return (
    <>
      <Navbar />
      <main>
        <OffMarketContent />
      </main>
      <Footer />
    </>
  );
}
