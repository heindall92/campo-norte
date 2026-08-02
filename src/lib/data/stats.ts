import type { Lead, LeadOrigin } from "@/lib/demo-data";
import { ORIGIN_LABEL } from "@/lib/demo-data";
import { decayedScore } from "@/lib/ai/lead-scoring-core";

/**
 * Prioridad real de llamada: el score guardado enfriado por el tiempo que lleva
 * sin tocarse. El número auditable no cambia; cambia el orden de la cola, que es
 * lo que de verdad decide a quién se llama hoy.
 */
export function effectiveScore(lead: Lead, now: Date = new Date()): number {
  return decayedScore(lead, now).effective;
}

export function computeLeadStats(leads: Lead[], now: Date = new Date()) {
  if (!leads.length) {
    return { sorted: [] as Lead[], unknown: 0, avg: 0, total: 0 };
  }
  const sorted = [...leads].sort(
    (a, b) => effectiveScore(b, now) - effectiveScore(a, now) || b.score - a.score,
  );
  const unknown = leads.filter((l) => l.origin === "unknown").length;
  const avg = Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length);
  return { sorted, unknown, avg, total: leads.length };
}

/** Atribución desde leads reales del Hub (Fase 1), no solo mix de expediciones demo */
export function computeOriginFromLeads(leads: Lead[]) {
  const totals: Record<LeadOrigin, number> = {
    web_form: 0,
    instagram: 0,
    referral: 0,
    brevo_click: 0,
    feria: 0,
    unknown: 0,
  };
  for (const l of leads) {
    totals[l.origin] += 1;
  }
  return (Object.keys(totals) as LeadOrigin[]).map((origin) => ({
    origin,
    label: ORIGIN_LABEL[origin],
    value: totals[origin],
  }));
}
