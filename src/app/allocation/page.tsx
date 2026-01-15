import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { AllocationContent } from "./allocation-content";

export const metadata: Metadata = {
  title: "Allocation Immobilière - Ophir Estate",
  description: "Accompagnement des family offices, banques privées et entrepreneurs dans l'allocation immobilière à Paris : diversification, risque, liquidité et projection.",
};

export default function AllocationPage() {
  return (
    <>
      <Navbar />
      <main>
        <AllocationContent />
      </main>
      <Footer />
    </>
  );
}
