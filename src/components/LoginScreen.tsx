import { COMPANY } from "@/lib/assumptions";
import { LOCAL_TEAM_USERS, useAuth } from "@/lib/auth";
import { allowLocalDemoAuth, isProdBuild } from "@/lib/runtime";
import { getSupabaseEnv } from "@/lib/supabase/client";
import { Bike, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

const LOGIN_VIDEO_SRC = "/media/login-home.mp4"; // Hero Login (comprimido)

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
    <div className="mps-crm relative min-h-[100dvh] overflow-x-hidden overflow-y-auto bg-[#1a1f1c]">
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
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/25 to-black/50" />
        <div className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-[color-mix(in_oklab,#0f1412_68%,transparent)] via-[color-mix(in_oklab,#0f1412_28%,transparent)] to-transparent md:w-[min(78%,56rem)]" />
      </div>

      {/*
        Móvil: centrado.
        Desktop/TV: panel en el tercio derecho-centro (donde marcó el usuario),
        con gutter derecho amplio para no pegarlo al borde.
      */}
      <div className="relative z-10 grid min-h-[100dvh] w-full grid-cols-1 items-center justify-items-center px-[clamp(1rem,3.5vw,2.5rem)] py-[clamp(1rem,3vh,2.5rem)] lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,min(26rem,28vw))_minmax(10rem,22vw)] lg:justify-items-stretch xl:grid-cols-[minmax(0,1.45fr)_minmax(22rem,min(28rem,26vw))_minmax(12rem,24vw)] 2xl:grid-cols-[minmax(0,1.55fr)_minmax(22rem,28rem)_minmax(14rem,26vw)]">
        <div className="hidden lg:block" aria-hidden />

        <div className="flex w-full max-w-[26rem] flex-col justify-center lg:max-w-none">
          <div className="mb-[clamp(1rem,2.5vh,1.75rem)] text-left">
            <div className="mb-3 flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-[var(--accent)] shadow-lg shadow-black/30 sm:mb-4 sm:h-14 sm:w-14">
              <span className="font-[family-name:var(--mps-display)] text-base font-bold leading-none text-white sm:text-lg">
                30
              </span>
              <span className="text-[7px] font-bold tracking-[0.14em] text-white/95 sm:text-[8px]">
                MPS
              </span>
            </div>
            <h1
              className="font-[family-name:var(--mps-display)] text-[clamp(1.6rem,2.4vw+0.8rem,2.35rem)] leading-tight text-white"
              style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
            >
              {COMPANY.name}
            </h1>
            <p
              className="mt-1.5 text-[clamp(0.8rem,0.4vw+0.7rem,0.95rem)] text-white/80"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}
            >
              Growth OS · acceso interno del equipo
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-[clamp(1.25rem,2vw,1.75rem)] border border-white/30 bg-[color-mix(in_oklab,white_88%,transparent)] p-[clamp(1rem,2vw,1.5rem)] shadow-2xl backdrop-blur-xl"
          >
            <p className="mb-3 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-wide text-[var(--ink-muted)] sm:mb-4 sm:text-xs">
              <Bike className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
              <span className="truncate">
                {supabaseReady
                  ? "Supabase Auth"
                  : demoAuth
                    ? "Demo local · equipo 30 MPS"
                    : "Producción · requiere Supabase Auth"}
              </span>
            </p>

            {demoAuth && isProdBuild() && (
              <p className="mb-3 rounded-xl border border-[color-mix(in_oklab,var(--warn-ink)_35%,transparent)] bg-[var(--warn-bg)] px-3 py-2 text-xs leading-snug text-[var(--warn-ink)] sm:mb-4 sm:text-sm">
                Login demo activo (pitch). Antes de producción real: Supabase Auth o{" "}
                <code className="font-semibold">VITE_STRICT_AUTH=true</code>.
              </p>
            )}

            {authBlocked && (
              <p className="mb-3 rounded-xl border border-[color-mix(in_oklab,var(--warn-ink)_35%,transparent)] bg-[var(--warn-bg)] px-3 py-2 text-xs leading-snug text-[var(--warn-ink)] sm:mb-4 sm:text-sm">
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
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-white/95 py-2.5 pl-10 pr-3 text-sm outline-none ring-[var(--accent)] focus:ring-2 disabled:opacity-50"
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
                  className="w-full rounded-xl border border-[var(--glass-border)] bg-white/95 py-2.5 pl-10 pr-10 text-sm outline-none ring-[var(--accent)] focus:ring-2 disabled:opacity-50"
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
              className="w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-bold text-white transition hover:opacity-95 disabled:opacity-60 sm:py-3"
            >
              {loading ? "Entrando…" : "Entrar al Growth OS"}
            </button>

            {demoAuth && (
              <div className="mt-3 max-h-[min(28vh,11rem)] overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-white/65 p-3 text-xs text-[var(--ink-muted)] sm:mt-4">
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

          <p className="mt-4 text-left text-xs text-white/75 sm:mt-6">{COMPANY.tagline}</p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-left text-xs text-white/65 sm:mt-3">
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

        <div className="hidden lg:block" aria-hidden />
      </div>
    </div>
  );
}
