export type NotificationKind =
  | "lead"
  | "client"
  | "reservation"
  | "invoice"
  | "import"
  | "system";

export type NotificationTone = "ok" | "info" | "warn" | "danger";

export type AppSection =
  | "hub"
  | "dashboard"
  | "leads"
  | "clientes"
  | "reservas"
  | "facturas"
  | "contenido"
  | "conocimiento"
  | "automatizaciones"
  | "propuesta"
  | "slides"
  | "ajustes";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  tone: NotificationTone;
  /** Nombre / entidad principal */
  actor: string;
  /** CONFIRMADA · MODIFICADA · CREADA · ELIMINADA… */
  statusLabel: string;
  body: string;
  detail?: string;
  createdAt: string;
  read: boolean;
  section?: AppSection;
  entityId?: string;
}

export const NOTIFICATIONS_KEY = "mps-notifications-v1";
