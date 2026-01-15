import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { ContactPageContent } from "./contact-content";

export const metadata: Metadata = {
  title: "Contact - Ophir Estate",
  description: "OPHIR reçoit les demandes de contact en mode discret. Aucune donnée patrimoniale n'est demandée en premier contact.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <ContactPageContent />
      </main>
      <Footer />
    </>
  );
}
