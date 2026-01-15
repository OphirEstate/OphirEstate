import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { AdvisoryContent } from "./advisory-content";

export const metadata: Metadata = {
  title: "Advisory Patrimonial - Ophir Estate",
  description: "Conseil indépendant auprès des familles, entrepreneurs et allocateurs de capital pour structurer, analyser et coordonner vos opérations patrimoniales.",
};

export default function AdvisoryPage() {
  return (
    <>
      <Navbar />
      <main>
        <AdvisoryContent />
      </main>
      <Footer />
    </>
  );
}
