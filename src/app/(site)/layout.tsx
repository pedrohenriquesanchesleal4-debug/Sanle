import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ChatWidget } from "@/components/site/ChatWidget";
import { TrafficTracker } from "@/components/site/TrafficTracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#08090C] text-[#F5F6F8] selection:bg-[#B7F36B] selection:text-[#08090C]">
      {/* Capturador silencioso de UTMs e referrers */}
      <TrafficTracker />

      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />

      {/* Assistente conversacional RAG */}
      <ChatWidget />
    </div>
  );
}
