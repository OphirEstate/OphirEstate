import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { PrivacyPolicyContent } from "./privacy-policy-content";

export const metadata: Metadata = {
  title: "Politique de Confidentialité - Ophir Estate",
  description: "Politique de confidentialité et protection des données personnelles d'Ophir Estate.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PrivacyPolicyContent />
      </main>
      <Footer />
    </>
  );
}
