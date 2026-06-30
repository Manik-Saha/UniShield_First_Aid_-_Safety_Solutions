import type { Metadata } from "next";
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { TrustBar } from "@/components/TrustBar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessSchema } from "@/lib/schema";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | UniShield First Aid & Safety",
    default: "UniShield First Aid & Safety | OSHA-Compliant Supplies, Services & Training — Southern California",
  },
  description:
    "First aid supplies, cabinet restocking services, and on-site safety training for businesses across Los Angeles, San Diego, Orange, Ventura, and San Bernardino counties. OSHA and ANSI compliant since 1996.",
  metadataBase: new URL("https://www.socalfirstaid.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink font-sans">
        <JsonLd schema={localBusinessSchema()} />
        <Header />
        <TrustBar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
