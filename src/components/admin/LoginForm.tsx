"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn, ArrowLeft } from "lucide-react";
import { errorMessage } from "@/lib/client-api";

export function LoginForm({
  supabaseReady,
  localDev
}: {
  supabaseReady: boolean;
  localDev: boolean;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Não foi possível entrar.");
        return;
      }
      const next = params.get("proximo") ?? "/admin";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  async function enterLocal() {
    setSending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@local", password: "local-dev" })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Modo local indisponível.");
        return;
      }
      router.push(params.get("proximo") ?? "/admin");
      router.refresh();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#969DA8] transition hover:text-[#F5F6F8]"
        >
          <ArrowLeft size={14} />
          <span>Voltar para a experiência</span>
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#78A9FF]">
          THE OPPORTUNITY ENGINE
        </span>
      </div>

      <form
        onSubmit={submit}
        className="rounded-hunter-lg border border-[#F5F6F8]/10 bg-[#191C22] p-7 shadow-hunter-card"
      >
        <div className="inline-flex items-center gap-2 font-display text-xl font-semibold text-[#F5F6F8]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#B7F36B] shadow-[0_0_10px_#B7F36B]" />
          <span>Sales Hunter</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold text-[#F5F6F8]">
          Acessar plataforma
        </h1>
        <p className="mt-1.5 text-sm text-[#969DA8]">
          Entre para pesquisar empresas, diagnosticar oportunidades e gerenciar seu pipeline comercial.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
              E-mail corporativo
            </span>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="voce@empresa.com.br"
              required
              disabled={!supabaseReady}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]">
              Senha
            </span>
            <input
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              required
              disabled={!supabaseReady}
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-[#F26464]">{error}</p>}

        <button
          type="submit"
          disabled={sending || !supabaseReady}
          className="btn btn-primary mt-6 w-full justify-center"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          Entrar na área de trabalho
        </button>

        {localDev && (
          <button
            type="button"
            onClick={enterLocal}
            className="btn btn-ghost mt-3 w-full justify-center text-xs"
          >
            Entrar no modo local gratuito (desenvolvimento)
          </button>
        )}
      </form>
    </div>
  );
}
