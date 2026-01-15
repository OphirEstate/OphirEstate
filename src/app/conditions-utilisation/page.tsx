import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { TermsContent } from "./terms-content";

export const metadata: Metadata = {
  title: "Conditions d'utilisation - Ophir Estate",
  description: "Conditions générales d'utilisation du site Ophir Estate.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}
