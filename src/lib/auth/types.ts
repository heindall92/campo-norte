export type UserRole = "admin" | "ops" | "booking" | "guide";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  roleLabel: string;
  avatarInitial: string;
  /** local = demo equipo; supabase = Auth real */
  provider: "local" | "supabase";
}

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: "Admin",
  ops: "Ops",
  booking: "Booking",
  guide: "Guía",
};

/**
 * Cuentas demo del equipo Campo Norte (solo cuando NO hay Supabase — ver
 * `allowLocalDemoAuth()`). Estas credenciales viajan en el bundle del cliente:
 * son públicas por definición y solo dan acceso a datos semilla ficticios.
 *
 * La contraseña se puede rotar sin tocar código con `VITE_DEMO_PASSWORD`.
 * Con Supabase configurado, estas cuentas quedan desactivadas por completo.
 */
const DEMO_PASSWORD =
  (import.meta.env.VITE_DEMO_PASSWORD as string | undefined)?.trim() || "camponorte2026";

export const LOCAL_TEAM_USERS: Array<AppUser & { password: string }> = [
  {
    id: "local-ana",
    email: "ana@campo-norte.demo",
    name: "Ana Torres",
    role: "admin",
    roleLabel: "Admin",
    avatarInitial: "A",
    provider: "local",
    password: DEMO_PASSWORD,
  },
  {
    id: "local-laura",
    email: "laura@campo-norte.demo",
    name: "Laura Vega",
    role: "booking",
    roleLabel: "Booking",
    avatarInitial: "L",
    provider: "local",
    password: DEMO_PASSWORD,
  },
  {
    id: "local-david",
    email: "david@campo-norte.demo",
    name: "David Ruiz",
    role: "ops",
    roleLabel: "Ops",
    avatarInitial: "D",
    provider: "local",
    password: DEMO_PASSWORD,
  },
  {
    id: "local-ramon",
    email: "ramon@campo-norte.demo",
    name: "Ramón Gil",
    role: "guide",
    roleLabel: "Guía",
    avatarInitial: "R",
    provider: "local",
    password: DEMO_PASSWORD,
  },
];

export const LOCAL_AUTH_KEY = "cn-auth-user-v1";
