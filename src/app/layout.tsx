import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Navbar } from "@/components/layout/navbar";
import { MobileCta } from "@/components/layout/mobile-cta";
import {
  organizationSchema,
  websiteSchema,
  productsSchema,
  faqSchema,
} from "@/lib/structured-data";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://lumiere.eu";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LUMIÈRE | Velas Aromáticas Premium de Soja & Aromaterapia",
    template: "%s | LUMIÈRE",
  },
  description:
    "Velas aromáticas premium em cera de soja e óleos essenciais, de produção artesanal. Rituais de bem-estar inspirados na aromaterapia. Envio para toda a Europa.",
  keywords: [
    "velas aromáticas premium",
    "velas aromáticas portugal",
    "velas de soja",
    "velas aromaterapia",
    "velas artesanais luxo",
    "velas de cera de soja",
    "velas óleos essenciais",
  ],
  authors: [{ name: "LUMIÈRE" }],
  creator: "LUMIÈRE",
  publisher: "LUMIÈRE",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "pt_PT",
    url: SITE_URL,
    siteName: "LUMIÈRE",
    title: "LUMIÈRE | Velas Aromáticas Premium de Soja & Aromaterapia",
    description:
      "Mais que um aroma. Bem-estar que se sente. Velas aromáticas premium para transformar momentos comuns em rituais de bem-estar.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Vela aromática premium LUMIÈRE",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMIÈRE | Velas Aromáticas Premium",
    description:
      "Mais que um aroma. Bem-estar que se sente. Velas aromáticas premium de cera de soja e óleos essenciais.",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "shopping",
};

export const viewport: Viewport = {
  themeColor: "#EDE8E1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              organizationSchema,
              websiteSchema,
              productsSchema,
              faqSchema,
            ]),
          }}
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <CartDrawer />
          <MobileCta />
        </CartProvider>
      </body>
    </html>
  );
}
