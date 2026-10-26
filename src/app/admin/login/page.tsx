import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata = { title: "Acessar Conta — Sales Hunter" };

export default function LoginPage() {
  const localDev = env.admin.localDevLogin && !env.isProduction && !env.supabase.configured;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#08090C] px-4 py-16 text-[#F5F6F8]">
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <LoginForm supabaseReady={env.supabase.configured} localDev={localDev} />
        </Suspense>
        <p className="mt-5 text-center font-mono text-[11px] leading-relaxed text-[#969DA8]/70">
          Acesso restrito e protegido por autenticação segura.
        </p>
      </div>
    </div>
  );
}
