/** Bus de confirmaciones premium en vista móvil (L1 dialog / L2 ticket). */

export type MobileSuccessPayload = {
  title: string;
  description?: string;
};

export type MobileTicketPayload = {
  title: string;
  subtitle?: string;
  headline: string;
  meta?: string;
  fields: { label: string; value: string }[];
  chips?: string[];
  primaryLabel?: string;
};

export const MOBILE_SUCCESS_EVENT = "mps-mobile-success";
export const MOBILE_TICKET_EVENT = "mps-mobile-ticket";

export function showMobileSuccess(payload: MobileSuccessPayload): void {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(max-width: 767px)").matches) return;
  window.dispatchEvent(new CustomEvent(MOBILE_SUCCESS_EVENT, { detail: payload }));
}

export function showMobileTicket(payload: MobileTicketPayload): void {
  if (typeof window === "undefined") return;
  if (!window.matchMedia("(max-width: 767px)").matches) return;
  window.dispatchEvent(new CustomEvent(MOBILE_TICKET_EVENT, { detail: payload }));
}
