import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ChatWidget } from "@/components/site/ChatWidget";
import { TrafficTracker } from "@/components/site/TrafficTracker";
import { FloatingConversionBar } from "@/components/site/FloatingConversionBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#0A0A09] text-[#F2EEE6] selection:bg-[#FF5B1F] selection:text-white">
      {/* Capturador silencioso de UTMs e referrers */}
      <TrafficTracker />

      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />

      {/* Botão inteligente de WhatsApp e barra fixa de ação rápida */}
      <FloatingConversionBar />

      {/* Assistente conversacional RAG */}
      <ChatWidget />
    </div>
  );
}
