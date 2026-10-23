import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, Geist_Mono, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { brand, siteUrl } from "@/content/brand";
import { SmoothScrollProvider } from "@/components/site/SmoothScrollProvider";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif"
});

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"]
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`
  },
  description: brand.shortPitch,
  applicationName: brand.name,
  keywords: [
    "Sales Hunter",
    "inteligência comercial",
    "prospecção B2B",
    "encontrar empresas",
    "oportunidades comerciais",
    "CRM B2B",
    "diagnóstico comercial",
    "Brasília",
    "DF"
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: brand.name,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortPitch
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.shortPitch
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#08090C" },
    { media: "(prefers-color-scheme: dark)", color: "#08090C" }
  ],
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable} ${spaceGrotesk.variable} dark`}
    >
      <body className="min-h-dvh antialiased bg-[#08090C] text-[#F5F6F8] selection:bg-[#B7F36B] selection:text-[#08090C]">
        <SmoothScrollProvider>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#B7F36B] focus:px-5 focus:py-3 focus:font-semibold focus:text-[#08090C]"
          >
            Pular para o conteúdo
          </a>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
