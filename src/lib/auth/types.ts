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

/** Cuentas demo del equipo 30 MPS (sin Supabase). Password: 30mps2026 */
export const LOCAL_TEAM_USERS: Array<AppUser & { password: string }> = [
  {
    id: "local-miguel",
    email: "miguel@30mps.com",
    name: "Miguel Checa",
    role: "admin",
    roleLabel: "Admin",
    avatarInitial: "M",
    provider: "local",
    password: "30mps2026",
  },
  {
    id: "local-laura",
    email: "laura@30mps.com",
    name: "Laura Romera",
    role: "booking",
    roleLabel: "Booking",
    avatarInitial: "L",
    provider: "local",
    password: "30mps2026",
  },
  {
    id: "local-david",
    email: "david@30mps.com",
    name: "David Rodríguez",
    role: "ops",
    roleLabel: "Ops",
    avatarInitial: "D",
    provider: "local",
    password: "30mps2026",
  },
  {
    id: "local-ramon",
    email: "ramon@30mps.com",
    name: "Ramón Faro",
    role: "guide",
    roleLabel: "Guía",
    avatarInitial: "R",
    provider: "local",
    password: "30mps2026",
  },
];

export const LOCAL_AUTH_KEY = "mps-auth-user-v1";
