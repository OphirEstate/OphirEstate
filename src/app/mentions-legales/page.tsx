import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { LegalNoticeContent } from "./legal-notice-content";

export const metadata: Metadata = {
  title: "Mentions Légales - Ophir Estate",
  description: "Mentions légales d'Ophir Estate, Maison patrimoniale à Paris.",
};

export default function LegalNoticePage() {
  return (
    <>
      <Navbar />
      <main>
        <LegalNoticeContent />
      </main>
      <Footer />
    </>
  );
}
