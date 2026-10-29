import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/content/brand";
import { SmoothScrollProvider } from "@/components/site/SmoothScrollProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
  weight: ["400", "500", "600", "700"]
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"]
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
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${fraunces.variable} scroll-smooth`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('sanle_theme');
                  var prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = savedTheme === 'dark' || (!savedTheme && prefDark);
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                    root.classList.remove('light');
                    root.setAttribute('data-theme', 'dark');
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.add('light');
                    root.classList.remove('dark');
                    root.setAttribute('data-theme', 'light');
                    root.style.colorScheme = 'light';
                  }
                  var savedLocale = localStorage.getItem('sanle_locale');
                  if (!savedLocale) {
                    var browserLang = (navigator.language || '').toLowerCase();
                    if (browserLang.startsWith('es')) savedLocale = 'es';
                    else if (browserLang.startsWith('en')) savedLocale = 'en';
                    else savedLocale = 'pt';
                  }
                  root.lang = savedLocale === 'pt' ? 'pt-BR' : savedLocale;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-cobalt selection:text-white overflow-x-clip w-full max-w-full relative">
        <ThemeProvider>
          <I18nProvider>
            <SmoothScrollProvider>
              <div className="w-full max-w-full relative">
                {children}
              </div>
            </SmoothScrollProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
