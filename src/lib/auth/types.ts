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
 * Cuentas demo del equipo 30 MPS (solo cuando NO hay Supabase — ver
 * `allowLocalDemoAuth()`). Estas credenciales viajan en el bundle del cliente:
 * son públicas por definición y solo dan acceso a datos semilla ficticios.
 *
 * La contraseña se puede rotar sin tocar código con `VITE_DEMO_PASSWORD`.
 * Con Supabase configurado, estas cuentas quedan desactivadas por completo.
 */
const DEMO_PASSWORD =
  (import.meta.env.VITE_DEMO_PASSWORD as string | undefined)?.trim() || "30mps2026";

export const LOCAL_TEAM_USERS: Array<AppUser & { password: string }> = [
  {
    id: "local-miguel",
    email: "miguel@30mps.com",
    name: "Miguel Checa",
    role: "admin",
    roleLabel: "Admin",
    avatarInitial: "M",
    provider: "local",
    password: DEMO_PASSWORD,
  },
  {
    id: "local-laura",
    email: "laura@30mps.com",
    name: "Laura Romera",
    role: "booking",
    roleLabel: "Booking",
    avatarInitial: "L",
    provider: "local",
    password: DEMO_PASSWORD,
  },
  {
    id: "local-david",
    email: "david@30mps.com",
    name: "David Rodríguez",
    role: "ops",
    roleLabel: "Ops",
    avatarInitial: "D",
    provider: "local",
    password: DEMO_PASSWORD,
  },
  {
    id: "local-ramon",
    email: "ramon@30mps.com",
    name: "Ramón Faro",
    role: "guide",
    roleLabel: "Guía",
    avatarInitial: "R",
    provider: "local",
    password: DEMO_PASSWORD,
  },
];

export const LOCAL_AUTH_KEY = "mps-auth-user-v1";
