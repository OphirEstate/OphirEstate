import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { CookiePolicyContent } from "./cookie-policy-content";

export const metadata: Metadata = {
  title: "Politique des Cookies - Ophir Estate",
  description: "Politique des cookies et traceurs du site Ophir Estate.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <CookiePolicyContent />
      </main>
      <Footer />
    </>
  );
}
