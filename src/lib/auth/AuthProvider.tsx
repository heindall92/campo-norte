import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSupabase, getSupabaseEnv } from "@/lib/supabase/client";
import {
  LOCAL_AUTH_KEY,
  LOCAL_TEAM_USERS,
  ROLE_LABEL,
  type AppUser,
  type UserRole,
} from "./types";

export interface AuthContextValue {
  ready: boolean;
  user: AppUser | null;
  supabaseReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function roleFromMeta(raw: unknown): UserRole {
  if (raw === "admin" || raw === "ops" || raw === "booking" || raw === "guide") return raw;
  return "ops";
}

function userFromLocalStorage(): AppUser | null {
  try {
    const raw = localStorage.getItem(LOCAL_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const supabaseReady = getSupabaseEnv().configured;

  useEffect(() => {
    let cancelled = false;
    const sb = getSupabase();

    async function boot() {
      if (sb) {
        const { data } = await sb.auth.getSession();
        if (cancelled) return;
        const session = data.session;
        if (session?.user) {
          const meta = session.user.user_metadata ?? {};
          const name =
            (meta.full_name as string) ||
            (meta.name as string) ||
            session.user.email?.split("@")[0] ||
            "Usuario";
          const role = roleFromMeta(meta.role);
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            name,
            role,
            roleLabel: ROLE_LABEL[role],
            avatarInitial: name.slice(0, 1).toUpperCase(),
            provider: "supabase",
          });
        } else {
          setUser(null);
        }

        const { data: sub } = sb.auth.onAuthStateChange((_event, next) => {
          if (!next?.user) {
            setUser(null);
            return;
          }
          const meta = next.user.user_metadata ?? {};
          const name =
            (meta.full_name as string) ||
            (meta.name as string) ||
            next.user.email?.split("@")[0] ||
            "Usuario";
          const role = roleFromMeta(meta.role);
          setUser({
            id: next.user.id,
            email: next.user.email ?? "",
            name,
            role,
            roleLabel: ROLE_LABEL[role],
            avatarInitial: name.slice(0, 1).toUpperCase(),
            provider: "supabase",
          });
        });

        setReady(true);
        return () => sub.subscription.unsubscribe();
      }

      // Sin Supabase: sesión local del equipo
      if (!cancelled) {
        setUser(userFromLocalStorage());
        setReady(true);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const sb = getSupabase();

    if (sb) {
      const { error } = await sb.auth.signInWithPassword({
        email: normalized,
        password,
      });
      if (error) throw new Error(error.message);
      return;
    }

    const match = LOCAL_TEAM_USERS.find(
      (u) => u.email === normalized && u.password === password,
    );
    if (!match) {
      throw new Error("Email o contraseña incorrectos (demo: miguel@30mps.com / 30mps2026)");
    }
    const { password: _pw, ...safe } = match;
    localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(safe));
    setUser(safe);
  }, []);

  const signOut = useCallback(async () => {
    const sb = getSupabase();
    if (sb) {
      await sb.auth.signOut();
    }
    localStorage.removeItem(LOCAL_AUTH_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ ready, user, supabaseReady, signIn, signOut }),
    [ready, user, supabaseReady, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
