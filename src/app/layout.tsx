import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, Geist_Mono, Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/content/brand";
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
    default: "Sanle — Engenharia de Processos & Automação Operacional",
    template: "%s · Sanle"
  },
  description:
    "Engenharia operacional que conecta os sistemas da sua empresa (ERP, WhatsApp, Notas Fiscais e Planilhas), eliminando retrabalho manual com governança estrita e previsibilidade.",
  applicationName: "Sanle",
  keywords: [
    "Sanle",
    "automação de processos",
    "automação operacional",
    "integração de ERP",
    "automação de processos Brasília",
    "integração Omie",
    "integração ContaAzul",
    "conciliação fiscal automática",
    "automação documental",
    "eliminar trabalho manual",
    "BPO financeiro Brasília",
    "barramento corporativo de dados",
    "trilha de auditoria append-only",
    "LGPD compliance processos",
    "engenharia de software Brasília DF",
    "Pedro Henrique Sanches Leal"
  ],
  authors: [{ name: "Pedro Henrique Sanches Leal", url: "https://www.linkedin.com/in/pedro-henrique-sanches-leal-a7a721278" }],
  creator: "Pedro Henrique Sanches Leal",
  publisher: "Sanle",
  alternates: {
    canonical: siteUrl
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Sanle",
    title: "Sanle — Engenharia de Processos & Automação Operacional",
    description:
      "Elimine o retrabalho manual. A Sanle conecta seus canais, documentos e ERP para sua empresa escalar com governança e previsibilidade.",
    images: [
      {
        url: "/images/studio-light.jpg",
        width: 1200,
        height: 630,
        alt: "Sanle — Engenharia de Processos & Automação Operacional"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanle — Engenharia de Processos & Automação Operacional",
    description:
      "Elimine o retrabalho manual. A Sanle conecta seus canais, documentos e ERP para sua empresa escalar com governança e previsibilidade.",
    images: ["/images/studio-light.jpg"]
  },
  verification: {
    google: "27eba1bc1966ebd8"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }]
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#08090C" }
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${instrumentSerif.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable} ${spaceGrotesk.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-cobalt selection:text-white overflow-x-clip w-full max-w-full relative">
        <SmoothScrollProvider>
          <div className="w-full max-w-full relative">
            {children}
          </div>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
