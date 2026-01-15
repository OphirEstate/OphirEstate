import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  Introduction,
  ParisPatrimoine,
  DiasporaBridge,
  Confidentiality,
  Vocation,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Introduction />
        <ParisPatrimoine />
        <DiasporaBridge />
        <Confidentiality />
        <Vocation />
      </main>
      <Footer />
    </>
  );
}
