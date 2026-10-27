"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn, ArrowLeft, ShieldCheck } from "lucide-react";
import { errorMessage } from "@/lib/client-api";

export function LoginForm({
  localDev
}: {
  supabaseReady?: boolean;
  localDev?: boolean;
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
        body: JSON.stringify({ email: email.trim(), password })
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
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "pedrohenriquesanchesleal4@gmail.com", password: "local-dev" })
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Acesso rápido indisponível.");
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
    <div className="relative z-20 w-full max-w-md pointer-events-auto select-text">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#969DA8] transition hover:text-[#F5F6F8]"
        >
          <ArrowLeft size={14} />
          <span>Voltar ao site da Sanle</span>
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#78A9FF]">
          SANLE · ADMIN & CRM
        </span>
      </div>

      <form
        onSubmit={submit}
        className="relative z-20 rounded-2xl border border-[#F5F6F8]/12 bg-[#14171F] p-7 shadow-2xl pointer-events-auto"
      >
        <div className="inline-flex items-center gap-2 font-display text-xl font-semibold text-[#F5F6F8]">
          <span className="h-2.5 w-2.5 rounded-full bg-[#B7F36B] shadow-[0_0_10px_#B7F36B]" />
          <span>Sanle · Sales Hunter</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-semibold text-[#F5F6F8]">
          Acessar plataforma
        </h1>
        <p className="mt-1.5 text-sm text-[#969DA8]">
          Entre com seu e-mail autorizado para pesquisar empresas, gerar demonstrações e gerenciar o pipeline comercial.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-login-email"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]"
            >
              E-mail administrativo
            </label>
            <input
              id="admin-login-email"
              name="email"
              type="email"
              className="field relative z-10 pointer-events-auto select-text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              placeholder="pedrohenriquesanchesleal4@gmail.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="admin-login-password"
              className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-[#969DA8]"
            >
              Senha de acesso
            </label>
            <input
              id="admin-login-password"
              name="password"
              type="password"
              className="field relative z-10 pointer-events-auto select-text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Digite sua senha (mín. 6 caracteres)"
              required
            />
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-[#F26464]/30 bg-[#F26464]/10 px-3.5 py-2.5 text-xs text-[#F26464]"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="btn btn-primary mt-6 w-full justify-center py-3 text-sm font-semibold cursor-pointer"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          <span>Entrar na área de trabalho</span>
        </button>

        {localDev && (
          <button
            type="button"
            onClick={enterLocal}
            disabled={sending}
            className="btn btn-ghost mt-3 w-full justify-center text-xs cursor-pointer"
          >
            <ShieldCheck size={14} />
            <span>Acesso rápido de desenvolvimento</span>
          </button>
        )}
      </form>
    </div>
  );
}
