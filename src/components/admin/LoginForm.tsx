"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, LogIn } from "lucide-react";
import { errorMessage } from "@/lib/client-api";

export function LoginForm({ supabaseReady, localDev }: { supabaseReady: boolean; localDev: boolean }) {
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
      <form onSubmit={submit} className="rounded-2xl border border-[var(--rule)] bg-white p-7 shadow-[0_30px_70px_-40px_rgba(18,17,16,0.4)]">
        <h1 className="font-display text-2xl text-ink">Painel Sanle</h1>
        <p className="mt-2 text-sm text-ink-soft">Acesso restrito à equipe autorizada.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-soft">E-mail</span>
            <input
              type="email"
              className="field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={!supabaseReady}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-ink-soft">Senha</span>
            <input
              type="password"
              className="field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={!supabaseReady}
            />
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-rust">{error}</p>}

        <button type="submit" disabled={sending || !supabaseReady} className="btn btn-primary mt-6 w-full justify-center">
          {sending ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          Entrar
        </button>

        {localDev && (
          <button type="button" onClick={enterLocal} className="btn btn-ghost mt-3 w-full justify-center">
            Entrar no modo local (desenvolvimento)
          </button>
        )}
      </form>
    </div>
  );
}
