"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Columns3,
  Compass,
  Send,
  MessagesSquare,
  Sparkles,
  BookOpen,
  PlugZap,
  Menu,
  X,
  LogOut,
  Search,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/auth";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string; "aria-hidden"?: boolean }>;
};

type NavGroup = {
  group: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    group: "Inteligência Comercial",
    items: [
      { href: "/admin", label: "Visão Geral", icon: LayoutDashboard },
      { href: "/admin/prospects", label: "Buscador de Empresas", icon: Compass },
      { href: "/admin/leads", label: "Oportunidades & Leads", icon: Users },
      { href: "/admin/pipeline", label: "Pipeline CRM", icon: Columns3 },
      { href: "/admin/abordagens", label: "Abordagens", icon: Send }
    ]
  },
  {
    group: "Assistência & Sistema",
    items: [
      { href: "/admin/conversas", label: "Conversas", icon: MessagesSquare },
      { href: "/admin/assistente", label: "Assistente IA", icon: Sparkles },
      { href: "/admin/conhecimento", label: "Base RAG", icon: BookOpen },
      { href: "/admin/integracoes", label: "Integrações", icon: PlugZap }
    ]
  }
];

/**
 * SALES HUNTER — DashboardShell (Seção 13 & 15)
 * Sidebar compacta (#111318), área de trabalho bem definida (#08090C)
 * e atalho rápido para o buscador de leads.
 */
export function DashboardShell({
  session,
  children
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="admin-theme flex min-h-dvh bg-[#08090C] text-[#F5F6F8]">
      {/* Sidebar compacta Desktop */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[#F5F6F8]/8 bg-[#111318] lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-[#F5F6F8]/8 px-5">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2.5 font-display text-base font-semibold tracking-tight text-[#F5F6F8]"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#B7F36B] shadow-[0_0_10px_#B7F36B]" />
            <span>Sales Hunter</span>
          </Link>
          <span className="rounded border border-[#F5F6F8]/12 bg-[#191C22] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#969DA8]">
            CRM
          </span>
        </div>

        {/* Acesso rápido ao buscador */}
        <div className="px-3 pt-4">
          <Link
            href="/admin/prospects"
            className="flex w-full items-center justify-between rounded-xl border border-[#B7F36B]/35 bg-[#B7F36B]/10 px-3.5 py-2.5 text-xs font-semibold text-[#B7F36B] transition hover:bg-[#B7F36B]/20"
          >
            <span className="inline-flex items-center gap-2">
              <Search size={14} />
              <span>Buscar empresas</span>
            </span>
            <span className="font-mono text-[10px] opacity-80">→</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.group}>
              <p className="px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#969DA8]/60">
                {group.group}
              </p>
              <div className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                        active
                          ? "bg-[#191C22] text-[#F5F6F8] shadow-[inset_2px_0_0_#B7F36B]"
                          : "text-[#969DA8] hover:bg-[#191C22]/60 hover:text-[#F5F6F8]"
                      )}
                    >
                      <Icon
                        size={15}
                        className={active ? "text-[#B7F36B]" : "text-[#969DA8]"}
                        aria-hidden
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-[#F5F6F8]/8 p-4">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#78A9FF] hover:underline"
          >
            <span>Ver experiência pública</span>
            <ExternalLink size={11} />
          </Link>
          <p className="truncate font-mono text-[11px] text-[#969DA8]">{session.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-2.5 flex w-full items-center gap-2 rounded-lg border border-[#F5F6F8]/10 bg-[#191C22] px-3 py-2 text-xs text-[#969DA8] transition hover:border-[#F26464]/40 hover:text-[#F26464]"
          >
            <LogOut size={14} /> Sair da conta
          </button>
        </div>
      </aside>

      {/* Área de trabalho principal */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar mobile */}
        <header className="flex h-15 items-center justify-between border-b border-[#F5F6F8]/8 bg-[#111318] px-4 py-3 lg:hidden">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 font-display text-base font-semibold text-[#F5F6F8]"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[#B7F36B]" />
            <span>Sales Hunter</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Alternar menu"
            className="rounded-lg border border-[#F5F6F8]/12 bg-[#191C22] p-2 text-[#F5F6F8]"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {open && (
          <nav className="grid gap-1 border-b border-[#F5F6F8]/10 bg-[#111318] p-3 lg:hidden">
            {NAV_GROUPS.flatMap((g) => g.items).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                    active
                      ? "bg-[#191C22] text-[#B7F36B]"
                      : "text-[#969DA8] hover:bg-[#191C22]/50 hover:text-[#F5F6F8]"
                  )}
                >
                  <Icon size={16} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#F26464]"
            >
              <LogOut size={16} /> Sair
            </button>
          </nav>
        )}

        <main className="flex-1 p-5 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
