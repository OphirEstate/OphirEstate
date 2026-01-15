import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/layout";
import { PatrimoineContent } from "./patrimoine-content";

export const metadata: Metadata = {
  title: "Patrimoine & Transmission - Ophir Estate",
  description: "Accompagnement des familles dans la transmission, succession et gestion de leur patrimoine immobilier parisien avec discrétion et expertise.",
};

export default function PatrimoinePage() {
  return (
    <>
      <Navbar />
      <main>
        <PatrimoineContent />
      </main>
      <Footer />
    </>
  );
}
