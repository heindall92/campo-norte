import type { Lead, LeadOrigin } from "@/lib/demo-data";
import { ORIGIN_LABEL } from "@/lib/demo-data";

export function computeLeadStats(leads: Lead[]) {
  if (!leads.length) {
    return { sorted: [] as Lead[], unknown: 0, avg: 0, total: 0 };
  }
  const sorted = [...leads].sort((a, b) => b.score - a.score);
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
