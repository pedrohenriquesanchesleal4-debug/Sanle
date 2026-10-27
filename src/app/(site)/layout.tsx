import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ChatWidget } from "@/components/site/ChatWidget";
import { TrafficTracker } from "@/components/site/TrafficTracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-[#08090C] text-[#F5F6F8] selection:bg-[#B7F36B] selection:text-[#08090C]">
      {/* =======================================================================
          FUNDO ATMOSFÉRICO FIXO UNIFICADO (Inspirado no #bg-gradient do why.zero.university)
          Luz volumétrica sutil elíptica que acompanha a viewport sem cortes bruscos
         ======================================================================= */}
      <div
        id="bg-gradient"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-700"
        style={{
          background: `
            radial-gradient(ellipse 110vw 90vh at 50% -10%, rgba(36, 64, 255, 0.08) 0%, transparent 60%),
            radial-gradient(ellipse 90vw 80vh at 80% 60%, rgba(183, 243, 107, 0.035) 0%, transparent 55%),
            radial-gradient(ellipse 100vw 90vh at 20% 90%, rgba(36, 64, 255, 0.05) 0%, transparent 60%),
            #08090C
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
