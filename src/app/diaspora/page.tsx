import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { DiasporaContent } from "./diaspora-content";

export const metadata: Metadata = {
  title: "Diaspora & Paris - Ophir Estate",
  description: "Accompagnement de la diaspora internationale dans la constitution ou le retour patrimonial à Paris avec discrétion et expertise.",
};

export default function DiasporaPage() {
  return (
    <>
      <Navbar />
      <main>
        <DiasporaContent />
      </main>
      <Footer />
    </>
  );
}
