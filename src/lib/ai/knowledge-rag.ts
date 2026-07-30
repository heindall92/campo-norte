import {
  EXPEDITIONS,
  KNOWLEDGE_ANSWERS,
  ROUTE_LABEL,
  type Client,
  type Expedition,
  type KnowledgeItem,
} from "@/lib/demo-data";
import type { Invoice, Reservation } from "@/lib/ops-data";
import { ollamaChat, parseJsonFromModel } from "./ollama";
import {
  KNOWLEDGE_KIND_LABEL,
  loadKnowledgeDocs,
  type KnowledgeDoc,
} from "./knowledge-store";
import { loadOllamaSettings, ollamaReady } from "./settings";

export interface KnowledgeChunk {
  id: string;
  title: string;
  text: string;
  sourceLabel: string;
  kind: string;
  score?: number;
}

export interface KnowledgeAskResult {
  answer: string;
  sources: string[];
  chunksUsed: KnowledgeChunk[];
  engine: "ollama" | "retrieval";
  why: string[];
}

export interface KnowledgeCorpusInput {
  docs?: KnowledgeDoc[];
  reservations?: Reservation[];
  invoices?: Invoice[];
  clients?: Client[];
  expeditions?: Expedition[];
  faq?: KnowledgeItem[];
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^a-z0-9áéíóúñü€%]+/i)
    .filter((t) => t.length > 2);
}

function scoreChunk(queryTokens: string[], chunk: KnowledgeChunk): number {
  const hay = tokenize(`${chunk.title} ${chunk.text} ${chunk.sourceLabel} ${chunk.kind}`);
  if (!hay.length || !queryTokens.length) return 0;
  const set = new Set(hay);
  let hits = 0;
  for (const t of queryTokens) {
    if (set.has(t)) hits += 1;
    // partial boost for year/route fragments
    else if (hay.some((h) => h.includes(t) || t.includes(h))) hits += 0.4;
  }
  const density = hits / queryTokens.length;
  const titleBoost = tokenize(chunk.title).some((t) => queryTokens.includes(t)) ? 0.25 : 0;
  return density + titleBoost;
}

export function buildKnowledgeChunks(input: KnowledgeCorpusInput = {}): KnowledgeChunk[] {
  const docs = input.docs ?? loadKnowledgeDocs();
  const reservations = input.reservations ?? [];
  const invoices = input.invoices ?? [];
  const expeditions = input.expeditions ?? EXPEDITIONS;
  const faq = input.faq ?? KNOWLEDGE_ANSWERS;
  const chunks: KnowledgeChunk[] = [];

  for (const d of docs) {
    chunks.push({
      id: d.id,
      title: d.title,
      text: d.content,
      sourceLabel: d.fileRef
        ? `${KNOWLEDGE_KIND_LABEL[d.kind]} · ${d.fileRef}`
        : KNOWLEDGE_KIND_LABEL[d.kind],
      kind: d.kind,
    });
  }

  for (const e of expeditions) {
    const margin = e.revenue > 0 ? ((e.revenue - e.cost) / e.revenue) * 100 : 0;
    chunks.push({
      id: `EXP-${e.id}`,
      title: `Expedición Hub · ${e.name}`,
      text: [
        `Ruta: ${ROUTE_LABEL[e.route]} (${e.route}).`,
        `Salida: ${e.departureAt}. Vehículo: ${e.vehicle}.`,
        `Ocupación: ${e.booked}/${e.seats}.`,
        `Ingresos: ${e.revenue.toLocaleString("es-ES")} € · Coste: ${e.cost.toLocaleString("es-ES")} €.`,
        `Margen bruto: ${margin.toFixed(1)} %.`,
      ].join(" "),
      sourceLabel: `Data Hub · Expedición ${e.id}`,
      kind: "historico",
    });
  }

  for (const r of reservations) {
    const lodges = r.itinerary.map((s) => `${s.day} ${s.place}: ${s.lodging}`).join("; ");
    const suppliers = r.logisticsContacts
      .map((c) => `${c.role}: ${c.name}${c.email ? ` <${c.email}>` : ""}`)
      .join("; ");
    chunks.push({
      id: `RES-${r.id}`,
      title: `Reserva ${r.id} · ${r.tripName}`,
      text: [
        `Cliente: ${r.clientName}. Ruta ${ROUTE_LABEL[r.route]}. Estado ${r.status}.`,
        `Importe ${r.totalAmount} € · depósito ${r.depositPaid} € · salida ${r.departureAt}.`,
        `Tour leader: ${r.tourLeader}.`,
        `Hoteles/lodges: ${lodges || "—"}.`,
        `Proveedores/contactos: ${suppliers || "—"}.`,
        `Notas internas: ${r.internalNotes}`,
      ].join(" "),
      sourceLabel: `Data Hub · Reserva ${r.id}`,
      kind: "hotel",
    });
  }

  for (const inv of invoices) {
    chunks.push({
      id: `INV-${inv.id}`,
      title: `Factura ${inv.number} · ${inv.expedition}`,
      text: [
        `Cliente ${inv.clientName} (${inv.clientNif}).`,
        `Base REAV ${inv.taxBase} € · IVA ${inv.vatAmount} € · Total ${inv.total} €.`,
        `Estado ${inv.status} · cobrado ${inv.amountCollected} € · régimen ${inv.regime}.`,
        `Fecha operación ${inv.operationDate}.`,
      ].join(" "),
      sourceLabel: `Data Hub · Factura ${inv.number}`,
      kind: "historico",
    });
  }

  for (const [i, k] of faq.entries()) {
    chunks.push({
      id: `FAQ-${i}`,
      title: k.q,
      text: `${k.a}\nPor qué importa: ${k.why.join(" · ")}`,
      sourceLabel: `Playbook · ${k.sources.join(", ")}`,
      kind: k.category,
    });
  }

  return chunks;
}

export function retrieveKnowledgeChunks(
  question: string,
  chunks: KnowledgeChunk[],
  topK = 6,
): KnowledgeChunk[] {
  const qTokens = tokenize(question);
  const ranked = chunks
    .map((c) => ({ ...c, score: scoreChunk(qTokens, c) }))
    .filter((c) => (c.score ?? 0) > 0.05)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

  if (ranked.length >= Math.min(3, topK)) return ranked.slice(0, topK);

  // fallback: return a few diverse seed chunks so the CEO always gets something
  return (ranked.length ? ranked : chunks.slice(0, topK)).slice(0, topK);
}

function synthesizeWithoutLlm(question: string, top: KnowledgeChunk[]): KnowledgeAskResult {
  if (!top.length) {
    return {
      answer:
        "No encontré fragmentos indexados para esa pregunta. Registra un PDF/ficha en la base documental o completa Reservas/Expediciones en el Hub.",
      sources: [],
      chunksUsed: [],
      engine: "retrieval",
      why: [
        "Sin contexto indexado el asistente no inventa cifras",
        "Añade docs (costes, hoteles, contratos) o usa datos vivos del Hub",
      ],
    };
  }

  const best = top[0];
  const extras = top.slice(1, 3).map((c) => `• ${c.title}: ${c.text.slice(0, 220)}…`);
  return {
    answer: [
      `Según la base documental interna (retrieval, sin LLM):`,
      ``,
      best.text,
      extras.length ? `\nTambién relevante:\n${extras.join("\n")}` : "",
      `\nPregunta: «${question}»`,
    ]
      .filter(Boolean)
      .join("\n"),
    sources: top.map((c) => c.sourceLabel),
    chunksUsed: top,
    engine: "retrieval",
    why: [
      "Respuesta extractiva desde documentos + Hub (sin llamar a Ollama)",
      "Activa Ollama en Ajustes para síntesis narrativa con las mismas fuentes",
      "Solo equipo interno — no se envía nada al viajero",
    ],
  };
}

async function synthesizeWithOllama(
  question: string,
  top: KnowledgeChunk[],
): Promise<KnowledgeAskResult> {
  const settings = loadOllamaSettings();
  const context = top
    .map(
      (c, i) =>
        `[#${i + 1}] ${c.title}\nFuente: ${c.sourceLabel}\n${c.text.slice(0, 1200)}`,
    )
    .join("\n\n");

  const { content } = await ollamaChat(
    [
      {
        role: "system",
        content: [
          "Eres el Knowledge Assistant interno de 30 MPS Adventures (solo equipo).",
          "Responde en español con hechos del CONTEXTO. Si no está en el contexto, dilo claramente.",
          "PROHIBIDO redactar mensajes al cliente o inventar hoteles/márgenes no citados.",
          "Devuelve JSON: answer (string), sources (array de strings de fuentes usadas), why (array de 2-3 razones de por qué importa al CEO).",
        ].join(" "),
      },
      {
        role: "user",
        content: `Pregunta del CEO:\n${question}\n\nCONTEXTO INDEXADO (RAG):\n${context}`,
      },
    ],
    {
      settings,
      format: {
        type: "object",
        properties: {
          answer: { type: "string" },
          sources: { type: "array", items: { type: "string" } },
          why: { type: "array", items: { type: "string" } },
        },
        required: ["answer", "sources"],
      },
    },
  );

  const raw = parseJsonFromModel(content) as Record<string, unknown>;
  const answer =
    typeof raw.answer === "string" && raw.answer.trim()
      ? raw.answer.trim()
      : content.trim();
  const sources = Array.isArray(raw.sources)
    ? (raw.sources as unknown[]).map(String)
    : top.map((c) => c.sourceLabel);
  const why = Array.isArray(raw.why)
    ? (raw.why as unknown[]).map(String)
    : ["Respuesta sintetizada con Ollama sobre fragmentos indexados"];

  return {
    answer,
    sources: sources.length ? sources : top.map((c) => c.sourceLabel),
    chunksUsed: top,
    engine: "ollama",
    why,
  };
}

/** Pregunta al Knowledge Assistant (RAG-lite + Ollama opcional). */
export async function askKnowledge(
  question: string,
  input: KnowledgeCorpusInput = {},
): Promise<KnowledgeAskResult> {
  const q = question.trim();
  if (!q) {
    return {
      answer: "Escribe una pregunta (ej. «¿Cuánto costó Mongolia 2025?»).",
      sources: [],
      chunksUsed: [],
      engine: "retrieval",
      why: [],
    };
  }

  const chunks = buildKnowledgeChunks(input);
  const top = retrieveKnowledgeChunks(q, chunks, 6);

  if (ollamaReady()) {
    try {
      return await synthesizeWithOllama(q, top);
    } catch {
      const fallback = synthesizeWithoutLlm(q, top);
      return {
        ...fallback,
        why: [
          ...fallback.why,
          "Ollama no disponible — se usó retrieval extractivo",
        ],
      };
    }
  }

  return synthesizeWithoutLlm(q, top);
}
