import { COMPANY } from "@/lib/assumptions";
import { LOCAL_TEAM_USERS, useAuth } from "@/lib/auth";
import { getSupabaseEnv } from "@/lib/supabase/client";
import { Bike, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function LoginScreen() {
  const { signIn, supabaseReady } = useAuth();
  const [email, setEmail] = useState(LOCAL_TEAM_USERS[0]?.email ?? "");
  const [password, setPassword] = useState(supabaseReady ? "" : "30mps2026");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mps-crm mps-bg relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[color-mix(in_oklab,var(--accent)_28%,transparent)] blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[color-mix(in_oklab,var(--accent-2)_22%,transparent)] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-[var(--accent)] shadow-lg">
            <span className="font-[family-name:var(--mps-display)] text-lg font-bold leading-none text-white">
              30
            </span>
            <span className="text-[8px] font-bold tracking-[0.14em] text-white/95">MPS</span>
          </div>
          <h1 className="font-[family-name:var(--mps-display)] text-3xl text-[var(--ink)]">
            {COMPANY.name}
          </h1>
          <p className="mt-2 text-sm text-[var(--ink-muted)]">
            Growth OS · acceso interno del equipo
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="glass-panel rounded-3xl border border-[var(--glass-border)] p-6 shadow-xl"
        >
          <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
            <Bike className="h-3.5 w-3.5 text-[var(--accent)]" />
            {supabaseReady ? "Supabase Auth" : "Demo local · equipo 30 MPS"}
          </p>

          <label className="mb-3 block text-sm font-semibold text-[var(--ink)]">
            Email
            <div className="relative mt-1.5">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] py-2.5 pl-10 pr-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
            </div>
          </label>

          <label className="mb-4 block text-sm font-semibold text-[var(--ink)]">
            Contraseña
            <div className="relative mt-1.5">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass-strong)] py-2.5 pl-10 pr-10 text-sm outline-none ring-[var(--accent)] focus:ring-2"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
                aria-label={showPw ? "Ocultar" : "Mostrar"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && (
            <p className="mb-3 rounded-xl border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar al Growth OS"}
          </button>

          {!supabaseReady && (
            <div className="mt-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-3 text-xs text-[var(--ink-muted)]">
              <p className="font-semibold text-[var(--ink)]">Cuentas demo</p>
              <ul className="mt-1 space-y-0.5">
                {LOCAL_TEAM_USERS.map((u) => (
                  <li key={u.id}>
                    <button
                      type="button"
                      className="text-left hover:text-[var(--accent)]"
                      onClick={() => {
                        setEmail(u.email);
                        setPassword(u.password);
                      }}
                    >
                      {u.name} · {u.email}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Password: <code className="text-[var(--accent)]">30mps2026</code>
              </p>
              <p className="mt-1">
                BD: configura <code>VITE_SUPABASE_*</code> en{" "}
                <code>.env.local</code> ({getSupabaseEnv().configured ? "OK" : "pendiente"}).
              </p>
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-[var(--ink-muted)]">
          {COMPANY.tagline}
        </p>
      </div>
    </div>
  );
}
