/**
 * KPIs de negocio a 6 meses — lenguaje de negocio, no de IA.
 * Metas del Growth OS para Miguel / 30 MPS.
 */

import type { Client, Expedition, Lead } from "@/lib/demo-data";
import { EXPEDITIONS } from "@/lib/demo-data";
import { MPS_ANNEX } from "@/lib/assumptions";
import type { Lang } from "@/lib/i18n";

export interface BusinessKpiDef {
  id: string;
  /** Meta numérica cuando aplica */
  target: number | null;
  unit: "pct" | "text" | "bool";
  es: { title: string; detail: string };
  en: { title: string; detail: string };
}

/** Los 6 KPIs de negocio (6 meses). Sin mencionar IA. */
export const BUSINESS_KPIS_6M: BusinessKpiDef[] = [
  {
    id: "origin_95",
    target: 95,
    unit: "pct",
    es: {
      title: "Origen del 95 % de los leads",
      detail: "Cada lead con canal/UTM medible (web, referido, feria, Brevo…). Sin origen = sin ROI de canal.",
    },
    en: {
      title: "Know the origin of 95% of leads",
      detail: "Every lead with a measurable channel/UTM. No origin = no channel ROI.",
    },
  },
  {
    id: "ceo_admin_60",
    target: 60,
    unit: "pct",
    es: {
      title: "−60 % tiempo administrativo del CEO",
      detail: "Menos triaje manual, menos Excel, menos ‘pregúntale a Miguel’. Baseline semana 1 → seguimiento mensual.",
    },
    en: {
      title: "−60% CEO administrative time",
      detail: "Less manual triage, less Excel, less ‘ask Miguel’. Week-1 baseline → monthly tracking.",
    },
  },
  {
    id: "reactivate_15",
    target: 15,
    unit: "pct",
    es: {
      title: "Reactivar un 15 % de clientes inactivos",
      detail: "Cola ‘contactar este mes’ → llamada humana. Meta: ~15 % de dormidos vuelven a reservar en 12 meses.",
    },
    en: {
      title: "Reactivate 15% of inactive clients",
      detail: "‘Contact this month’ queue → human call. Target: ~15% of dormants book again within 12 months.",
    },
  },
  {
    id: "occupancy_up",
    target: null,
    unit: "text",
    es: {
      title: "Subir la ocupación media por expedición",
      detail: "Más plazas llenas por salida = mejor margen y experiencia de grupo.",
    },
    en: {
      title: "Raise average occupancy per expedition",
      detail: "More filled seats per departure = better margin and group experience.",
    },
  },
  {
    id: "margin_up",
    target: MPS_ANNEX.marginTargetPct,
    unit: "pct",
    es: {
      title: "Mejorar el margen por ruta",
      detail: `Objetivo de casa ~${MPS_ANNEX.marginTargetPct} % bruto por salida. Precio y coste visibles en el dashboard.`,
    },
    en: {
      title: "Improve margin per route",
      detail: `House target ~${MPS_ANNEX.marginTargetPct}% gross per departure. Price and cost visible on the dashboard.`,
    },
  },
  {
    id: "dashboard_daily",
    target: null,
    unit: "bool",
    es: {
      title: "Dashboard actualizado a diario",
      detail: "Una pantalla para decidir: origen, ocupación, margen, gap a 1M €. Datos vivos del Hub.",
    },
    en: {
      title: "Dashboard updated daily",
      detail: "One screen to decide: origin, occupancy, margin, gap to €1M. Live Hub data.",
    },
  },
];

export interface BusinessKpiSnapshot {
  id: string;
  title: string;
  detail: string;
  /** Valor actual medible (null si es cualitativo / baseline manual) */
  current: number | null;
  target: number | null;
  unit: BusinessKpiDef["unit"];
  /** good = en camino / meta; warn = lejos; neutral = manual */
  tone: "good" | "warn" | "neutral" | "brand";
  /** Texto corto del valor (ej. "72 %" o "Baseline manual") */
  display: string;
}

function avgOccupancyPct(expeditions: Expedition[]): number {
  if (!expeditions.length) return 0;
  const sum = expeditions.reduce((s, e) => s + (e.seats ? e.booked / e.seats : 0), 0);
  return Math.round((sum / expeditions.length) * 100);
}

function avgMarginPct(expeditions: Expedition[]): number {
  if (!expeditions.length) return 0;
  const sum = expeditions.reduce((s, e) => {
    if (!e.revenue) return s;
    return s + ((e.revenue - e.cost) / e.revenue) * 100;
  }, 0);
  return Math.round(sum / expeditions.length);
}

function dormantPool(clients: Client[]): Client[] {
  return clients.filter(
    (c) => c.segment === "dormido" || c.segment === "en_riesgo" || c.status === "dormido",
  );
}

/**
 * Snapshot vivo desde Hub + expediciones.
 * CEO admin time no se mide automático → baseline manual.
 */
export function computeBusinessKpis(
  lang: Lang,
  input: {
    leads: Lead[];
    clients: Client[];
    expeditions?: Expedition[];
    hubUpdatedAt?: string | null;
  },
): BusinessKpiSnapshot[] {
  const expeditions = input.expeditions ?? EXPEDITIONS;
  const leads = input.leads;
  const known = leads.filter((l) => l.origin !== "unknown").length;
  const originPct = leads.length ? Math.round((known / leads.length) * 100) : 0;

  const dormants = dormantPool(input.clients);
  const inContactQueue = input.clients.filter(
    (c) =>
      c.contactThisMonth ||
      (c.reactivationPriority >= 70 &&
        (c.segment === "dormido" || c.segment === "en_riesgo")),
  ).length;
  /** Proxy de avance: % de dormidos ya priorizados para contacto este mes */
  const reactivateProxy =
    dormants.length > 0 ? Math.round((inContactQueue / dormants.length) * 100) : 0;

  const occ = avgOccupancyPct(expeditions);
  const margin = avgMarginPct(expeditions);
  const hubFresh =
    Boolean(input.hubUpdatedAt) &&
    Date.now() - new Date(input.hubUpdatedAt!).getTime() < 1000 * 60 * 60 * 36;

  return BUSINESS_KPIS_6M.map((def) => {
    const copy = lang === "es" ? def.es : def.en;
    switch (def.id) {
      case "origin_95":
        return {
          id: def.id,
          title: copy.title,
          detail: copy.detail,
          current: originPct,
          target: 95,
          unit: "pct",
          tone: originPct >= 95 ? "good" : originPct >= 70 ? "brand" : "warn",
          display: `${originPct} %`,
        };
      case "ceo_admin_60":
        return {
          id: def.id,
          title: copy.title,
          detail: copy.detail,
          current: null,
          target: 60,
          unit: "pct",
          tone: "neutral",
          display: lang === "es" ? "Baseline manual (sem. 1)" : "Manual baseline (wk 1)",
        };
      case "reactivate_15":
        return {
          id: def.id,
          title: copy.title,
          detail: copy.detail,
          current: reactivateProxy,
          target: 15,
          unit: "pct",
          tone: reactivateProxy >= 15 ? "good" : "warn",
          display:
            lang === "es"
              ? `${inContactQueue}/${dormants.length || "—"} en cola · meta 15 %`
              : `${inContactQueue}/${dormants.length || "—"} queued · 15% target`,
        };
      case "occupancy_up":
        return {
          id: def.id,
          title: copy.title,
          detail: copy.detail,
          current: occ,
          target: null,
          unit: "pct",
          tone: occ >= 90 ? "good" : occ >= 75 ? "brand" : "warn",
          display: lang === "es" ? `${occ} % media` : `${occ}% avg`,
        };
      case "margin_up":
        return {
          id: def.id,
          title: copy.title,
          detail: copy.detail,
          current: margin,
          target: MPS_ANNEX.marginTargetPct,
          unit: "pct",
          tone: margin >= MPS_ANNEX.marginTargetPct ? "good" : "warn",
          display: `${margin} % · meta ${MPS_ANNEX.marginTargetPct} %`,
        };
      case "dashboard_daily":
        return {
          id: def.id,
          title: copy.title,
          detail: copy.detail,
          current: hubFresh ? 1 : 0,
          target: 1,
          unit: "bool",
          tone: hubFresh ? "good" : "warn",
          display: hubFresh
            ? lang === "es"
              ? "Hub actualizado"
              : "Hub up to date"
            : lang === "es"
              ? "Actualizar Hub / importar"
              : "Refresh Hub / import",
        };
      default:
        return {
          id: def.id,
          title: copy.title,
          detail: copy.detail,
          current: null,
          target: def.target,
          unit: def.unit,
          tone: "neutral",
          display: "—",
        };
    }
  });
}
