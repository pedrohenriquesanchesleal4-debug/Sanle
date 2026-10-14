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
  LogOut
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Painel", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/pipeline", label: "Pipeline", icon: Columns3 },
  { href: "/admin/prospects", label: "Prospecção", icon: Compass },
  { href: "/admin/abordagens", label: "Abordagens", icon: Send },
  { href: "/admin/conversas", label: "Conversas", icon: MessagesSquare },
  { href: "/admin/assistente", label: "Assistente", icon: Sparkles },
  { href: "/admin/conhecimento", label: "Conhecimento", icon: BookOpen },
  { href: "/admin/integracoes", label: "Integrações", icon: PlugZap }
];

export function AdminShell({ session, children }: { session: Session; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="admin-theme flex min-h-dvh bg-[var(--paper)]">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--rule)] bg-ink text-paper lg:flex">
        <div className="flex h-16 items-center px-6">
          <Link href="/admin" className="text-lg">
            <Logo tone="paper" />
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                  active ? "bg-paper/10 text-paper" : "text-paper/65 hover:bg-paper/5 hover:text-paper"
                )}
              >
                <Icon size={17} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-paper/10 p-4">
          <p className="truncate text-xs text-paper/60">{session.email}</p>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-paper/70 transition hover:bg-paper/5 hover:text-paper"
          >
            <LogOut size={15} /> Sair
          </button>
        </div>
      </aside>

      {/* Topbar mobile */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[var(--rule)] bg-white px-4 lg:hidden">
          <Link href="/admin" className="text-lg text-ink">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Alternar menu"
            className="rounded-lg border border-[var(--rule)] p-2 text-ink"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {open && (
          <nav className="grid gap-1 border-b border-[var(--rule)] bg-white p-3 lg:hidden">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                    isActive(item.href) ? "bg-cobalt/8 text-cobalt" : "text-ink-soft hover:bg-black/[0.03]"
                  )}
                >
                  <Icon size={17} aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rust"
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
