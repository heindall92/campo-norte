import { COMPANY } from "@/lib/assumptions";
import { LOCAL_TEAM_USERS, useAuth } from "@/lib/auth";
import { allowLocalDemoAuth, isProdBuild } from "@/lib/runtime";
import { getSupabaseEnv } from "@/lib/supabase/client";
import { Bike, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

const LOGIN_VIDEO_SRC = "/media/login-home.mp4";

export function LoginScreen() {
  const { signIn, supabaseReady } = useAuth();
  const demoAuth = allowLocalDemoAuth() && !supabaseReady;
  const [email, setEmail] = useState(LOCAL_TEAM_USERS[0]?.email ?? "");
  const [password, setPassword] = useState(demoAuth ? "30mps2026" : "");
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

  const authBlocked = !supabaseReady && !allowLocalDemoAuth();

  return (
    <div className="mps-crm relative min-h-screen overflow-hidden bg-[#1a1f1c]">
      {/* Fondo vídeo full-bleed */}
      <div className="absolute inset-0" aria-hidden>
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={LOGIN_VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Lectura del formulario a la derecha + atmósfera a la izquierda */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/20 to-black/55" />
        <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[color-mix(in_oklab,#0f1412_72%,transparent)] via-[color-mix(in_oklab,#0f1412_35%,transparent)] to-transparent md:w-[min(56%,42rem)]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-stretch justify-end px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex w-full max-w-md flex-col justify-center">
          <div className="mb-7 text-left">
            <div className="mb-4 flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-[var(--accent)] shadow-lg shadow-black/30">
              <span className="font-[family-name:var(--mps-display)] text-lg font-bold leading-none text-white">
                30
              </span>
              <span className="text-[8px] font-bold tracking-[0.14em] text-white/95">MPS</span>
            </div>
            <h1 className="font-[family-name:var(--mps-display)] text-3xl text-white drop-shadow-sm md:text-4xl">
              {COMPANY.name}
            </h1>
            <p className="mt-2 text-sm text-white/75">Growth OS · acceso interno del equipo</p>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-white/25 bg-[color-mix(in_oklab,white_82%,transparent)] p-6 shadow-2xl backdrop-blur-xl"
          >
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
              <Bike className="h-3.5 w-3.5 text-[var(--accent)]" />
              {supabaseReady
                ? "Supabase Auth"
                : demoAuth
                  ? "Demo local · equipo 30 MPS"
                  : "Producción · requiere Supabase Auth"}
            </p>

            {demoAuth && isProdBuild() && (
              <p className="mb-4 rounded-xl border border-[color-mix(in_oklab,var(--warn-ink)_35%,transparent)] bg-[var(--warn-bg)] px-3 py-2 text-sm text-[var(--warn-ink)]">
                Login demo activo (pitch). Antes de producción real: Supabase Auth o{" "}
                <code className="font-semibold">VITE_STRICT_AUTH=true</code>.
              </p>
            )}

            {authBlocked && (
              <p className="mb-4 rounded-xl border border-[color-mix(in_oklab,var(--warn-ink)_35%,transparent)] bg-[var(--warn-bg)] px-3 py-2 text-sm text-[var(--warn-ink)]">
                El login demo está desactivado en este entorno. Configura{" "}
                <code className="font-semibold">VITE_SUPABASE_URL</code> y{" "}
                <code className="font-semibold">VITE_SUPABASE_ANON_KEY</code> en Vercel, o activa
                temporalmente <code className="font-semibold">VITE_ALLOW_DEMO_AUTH=true</code> solo
                para una demo controlada.
              </p>
            )}

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
                  disabled={authBlocked}
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-white/90 py-2.5 pl-10 pr-3 text-sm outline-none ring-[var(--accent)] focus:ring-2 disabled:opacity-50"
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
                  disabled={authBlocked}
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-white/90 py-2.5 pl-10 pr-10 text-sm outline-none ring-[var(--accent)] focus:ring-2 disabled:opacity-50"
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
              disabled={loading || authBlocked}
              className="w-full rounded-xl bg-[var(--accent)] py-3 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Entrando…" : "Entrar al Growth OS"}
            </button>

            {demoAuth && (
              <div className="mt-4 rounded-xl border border-[var(--glass-border)] bg-white/60 p-3 text-xs text-[var(--ink-muted)]">
                <p className="font-semibold text-[var(--ink)]">Cuentas demo (solo local)</p>
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
                  BD: configura <code>VITE_SUPABASE_*</code> en <code>.env.local</code> (
                  {getSupabaseEnv().configured ? "OK" : "pendiente"}).
                </p>
              </div>
            )}
          </form>

          <p className="mt-6 text-left text-xs text-white/70">{COMPANY.tagline}</p>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-left text-xs text-white/65">
            <a href="/legal#aviso" className="hover:text-white hover:underline">
              Aviso legal
            </a>
            <a href="/legal#privacidad" className="hover:text-white hover:underline">
              Privacidad
            </a>
            <a href="/legal#cookies" className="hover:text-white hover:underline">
              Cookies
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
