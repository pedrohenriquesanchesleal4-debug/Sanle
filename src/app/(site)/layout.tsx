import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ChatWidget } from "@/components/site/ChatWidget";
import { TrafficTracker } from "@/components/site/TrafficTracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#07080A] text-[#F5F6F8] selection:bg-[#2440FF] selection:text-white">
      {/* =======================================================================
          FUNDO ATMOSFÉRICO OBSIDIAN STUDIO (#07080A com luz cobalto sutil de 4%)
          Zero gradientes verde/amarelo neon de IA. Atmosfera de ateliê de alta precisão.
         ======================================================================= */}
      <div
        id="bg-gradient"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(ellipse 110vw 90vh at 50% -10%, rgba(36, 64, 255, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 100vw 90vh at 20% 90%, rgba(36, 64, 255, 0.03) 0%, transparent 60%),
            #07080A
          `
        }}
        aria-hidden="true"
      />

      {/* Capturador silencioso de UTMs e referrers */}
      <TrafficTracker />

      <SiteHeader />
      <main id="conteudo" className="relative z-10 flex-1">
        {children}
      </main>
      <SiteFooter />

      {/* Assistente conversacional RAG */}
      <ChatWidget />
    </div>
  );
}
