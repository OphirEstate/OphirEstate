import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { OffMarketClauseContent } from "./off-market-clause-content";

export const metadata: Metadata = {
  title: "Clause Off-Market - Ophir Estate",
  description: "Clause de confidentialité Off-Market d'Ophir Estate.",
};

export default function OffMarketClausePage() {
  return (
    <>
      <Navbar />
      <main>
        <OffMarketClauseContent />
      </main>
      <Footer />
    </>
  );
}
