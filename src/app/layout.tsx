import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { ClientLayout } from "@/components/layout";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Ophir Estate - Immobilier de Luxe",
  description: "Une sélection exclusive de biens d'exception où la simplicité rencontre le luxe absolu.",
  icons: {
    icon: [
      { url: "/images/Icon-OphirEstate.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/Icon-OphirEstate.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Ophir Estate - Immobilier de Luxe",
    description: "Une sélection exclusive de biens d'exception où la simplicité rencontre le luxe absolu.",
    type: "website",
    locale: "fr_FR",
    siteName: "Ophir Estate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <LanguageProvider>
          <ClientLayout>{children}</ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
