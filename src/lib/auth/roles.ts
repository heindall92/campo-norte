import type { AppSection } from "@/lib/notifications";
import type { UserRole } from "./types";

/** Admin / CEO / founder: acceso total + gestión de usuarios. */
export function isPrivilegedAdmin(role: UserRole | undefined | null): boolean {
  return role === "admin";
}

export const ROLE_DESCRIPTION: Record<UserRole, { es: string; en: string }> = {
  admin: {
    es: "CEO / founder · acceso total y gestión de usuarios del CRM",
    en: "CEO / founder · full access and CRM user management",
  },
  ops: {
    es: "Ops / Tour Manager · leads, clientes, reservas y automatizaciones",
    en: "Ops / Tour Manager · leads, clients, bookings and automations",
  },
  booking: {
    es: "Office / Booking · clientes, reservas, facturas y contenido",
    en: "Office / Booking · clients, bookings, invoices and content",
  },
  guide: {
    es: "Guía · reservas y conocimiento operativo (sesión limitada)",
    en: "Guide · bookings and ops knowledge (limited session)",
  },
};

/** Secciones del menú visibles por rol (capa multicapa). */
export const ROLE_ALLOWED_SECTIONS: Record<UserRole, readonly AppSection[]> = {
  admin: [
    "hub",
    "dashboard",
    "leads",
    "clientes",
    "reservas",
    "facturas",
    "contenido",
    "conocimiento",
    "automatizaciones",
    "propuesta",
    "slides",
    "ajustes",
  ],
  ops: [
    "hub",
    "dashboard",
    "leads",
    "clientes",
    "reservas",
    "conocimiento",
    "automatizaciones",
    "propuesta",
    "slides",
    "ajustes",
  ],
  booking: [
    "hub",
    "dashboard",
    "clientes",
    "reservas",
    "facturas",
    "contenido",
    "conocimiento",
    "ajustes",
  ],
  guide: ["hub", "reservas", "conocimiento", "slides", "ajustes"],
};

export function canAccessSection(role: UserRole, section: AppSection): boolean {
  return ROLE_ALLOWED_SECTIONS[role].includes(section);
}

/** Ajustes sensibles solo admin (negocio, IA, BD, usuarios). */
export function canManageCrmUsers(role: UserRole | undefined | null): boolean {
  return isPrivilegedAdmin(role);
}

export function canEditBusinessSettings(role: UserRole | undefined | null): boolean {
  return isPrivilegedAdmin(role);
}

export function canEditAiSettings(role: UserRole | undefined | null): boolean {
  return isPrivilegedAdmin(role);
}

export function canViewDatabaseCard(role: UserRole | undefined | null): boolean {
  return isPrivilegedAdmin(role);
}

export const ASSIGNABLE_ROLES: UserRole[] = ["admin", "ops", "booking", "guide"];
