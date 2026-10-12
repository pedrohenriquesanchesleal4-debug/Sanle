import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { authSetupHint } from "@/lib/auth";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata = { title: "Entrar — Painel Sanle" };

export default function LoginPage() {
  const localDev = env.admin.localDevLogin && !env.isProduction && !env.supabase.configured;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink px-4 py-16">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <LoginForm supabaseReady={env.supabase.configured} localDev={localDev} />
        </Suspense>
        <p className="mt-5 text-center text-xs leading-relaxed text-paper/50">{authSetupHint()}</p>
      </div>
    </div>
  );
}
