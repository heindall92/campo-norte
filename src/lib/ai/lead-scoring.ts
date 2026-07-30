import type { Client, Lead, LeadOrigin } from "@/lib/demo-data";
import { ORIGIN_LABEL, ROUTE_LABEL } from "@/lib/demo-data";
import { ollamaChat, parseJsonFromModel } from "./ollama";
import { loadOllamaSettings, ollamaReady } from "./settings";

export type LeadScoreSource = "heuristic" | "ollama";

export type LeadPriority = "muy_alta" | "alta" | "media" | "baja";

export interface LeadScoreResult {
  score: number;
  priority: LeadPriority;
  reasons: string[];
  source: LeadScoreSource;
}

export function priorityFromScore(score: number): LeadPriority {
  if (score >= 85) return "muy_alta";
  if (score >= 70) return "alta";
  if (score >= 50) return "media";
  return "baja";
}

export function priorityLabel(p: LeadPriority, lang: "es" | "en" = "es"): string {
  const es: Record<LeadPriority, string> = {
    muy_alta: "Muy alta prioridad",
    alta: "Alta prioridad",
    media: "Prioridad media",
    baja: "Baja prioridad",
  };
  const en: Record<LeadPriority, string> = {
    muy_alta: "Very high priority",
    alta: "High priority",
    media: "Medium priority",
    baja: "Low priority",
  };
  return lang === "es" ? es[p] : en[p];
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function originBoost(origin: LeadOrigin): number {
  switch (origin) {
    case "referral":
      return 22;
    case "web_form":
      return 14;
    case "brevo_click":
      return 12;
    case "feria":
      return 8;
    case "instagram":
      return 6;
    default:
      return 0;
  }
}

/** Scoring determinístico Fase 3 — solo clasifica. */
export function scoreLeadHeuristic(lead: Lead, linked?: Client | null): LeadScoreResult {
  const reasons: string[] = [];
  let score = 35;

  const boost = originBoost(lead.origin);
  if (boost) {
    score += boost;
    reasons.push(`Canal: ${ORIGIN_LABEL[lead.origin]}`);
  } else {
    reasons.push("Sin origen claro");
  }

  if (lead.interestRoute) {
    score += 12;
    reasons.push(`Destino: ${ROUTE_LABEL[lead.interestRoute]}`);
  }
  if (lead.vehicle) {
    score += 4;
    reasons.push(`Vehículo: ${lead.vehicle}`);
  }
  if (lead.campaign) {
    score += 6;
    reasons.push(`Campaña: ${lead.campaign}`);
  }

  if (linked) {
    if (linked.trips > 0) {
      score += 18;
      reasons.push(
        linked.trips === 1
          ? "Cliente con viaje previo"
          : `Cliente repetidor (${linked.trips} viajes)`,
      );
    }
    if (linked.ltv >= 10_000) {
      score += 12;
      reasons.push("Alto poder adquisitivo (LTV)");
    }
    if (linked.brevoOpens >= 5) {
      score += 8;
      reasons.push(`Ha abierto ${linked.brevoOpens} emails (Brevo)`);
    }
    const mongoliaVisits = linked.history.filter((h) => h.route === "MONGOLIA").length;
    if (mongoliaVisits >= 1) {
      score += 6;
      reasons.push(
        mongoliaVisits >= 2
          ? `Visitó Mongolia ${mongoliaVisits} veces`
          : "Interés / historial Mongolia",
      );
    }
  }

  if (lead.status === "cualificado") score += 8;
  if (lead.status === "reservado") score += 15;

  score = clamp(score);
  if (score >= 80) reasons.push("Probabilidad de compra alta");

  return {
    score,
    priority: priorityFromScore(score),
    reasons: reasons.slice(0, 8),
    source: "heuristic",
  };
}

async function scoreLeadWithOllama(lead: Lead, linked?: Client | null): Promise<LeadScoreResult> {
  const fallback = scoreLeadHeuristic(lead, linked);
  const settings = loadOllamaSettings();
  const payload = {
    leadId: lead.id,
    origin: lead.origin,
    campaign: lead.campaign,
    status: lead.status,
    interestRoute: lead.interestRoute,
    vehicle: lead.vehicle,
    linkedClient: linked
      ? {
          trips: linked.trips,
          ltv: linked.ltv,
          brevoOpens: linked.brevoOpens,
          segment: linked.segment,
          routes: linked.history.map((h) => h.route),
        }
      : null,
  };

  const { content } = await ollamaChat(
    [
      {
        role: "system",
        content: [
          "Eres el motor de Lead Scoring de 30 MPS Adventures.",
          "SOLO clasificas leads para el equipo. PROHIBIDO responder al cliente o redactar mensajes salientes.",
          "Devuelve JSON: score (0-100), reasons (array de strings cortos en español), priority (muy_alta|alta|media|baja).",
        ].join(" "),
      },
      {
        role: "user",
        content: `Puntúa este lead:\n${JSON.stringify(payload)}`,
      },
    ],
    {
      settings,
      format: {
        type: "object",
        properties: {
          score: { type: "number" },
          reasons: { type: "array", items: { type: "string" } },
          priority: { type: "string" },
        },
        required: ["score", "reasons"],
      },
    },
  );

  const raw = parseJsonFromModel(content) as Record<string, unknown>;
  const score = clamp(Number(raw.score) || fallback.score);
  const reasons = Array.isArray(raw.reasons)
    ? (raw.reasons as unknown[]).map(String).filter(Boolean).slice(0, 8)
    : fallback.reasons;
  const priority =
    raw.priority === "muy_alta" ||
    raw.priority === "alta" ||
    raw.priority === "media" ||
    raw.priority === "baja"
      ? raw.priority
      : priorityFromScore(score);

  return { score, priority, reasons: reasons.length ? reasons : fallback.reasons, source: "ollama" };
}

export async function scoreLead(
  lead: Lead,
  linked?: Client | null,
  options?: { forceHeuristic?: boolean },
): Promise<LeadScoreResult> {
  if (options?.forceHeuristic || !ollamaReady()) {
    return scoreLeadHeuristic(lead, linked);
  }
  try {
    return await scoreLeadWithOllama(lead, linked);
  } catch {
    const h = scoreLeadHeuristic(lead, linked);
    return {
      ...h,
      reasons: [...h.reasons, "Fallback heurístico (Ollama no disponible)"],
    };
  }
}

export function applyScoreToLead(lead: Lead, result: LeadScoreResult): Lead {
  return {
    ...lead,
    score: result.score,
    scoreReasons: result.reasons,
    lastTouchAt: new Date().toISOString().slice(0, 10),
  };
}
