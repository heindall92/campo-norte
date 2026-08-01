"use client";

import { applyScoreToLead, priorityFromScore, priorityLabel, scoreLead } from "@/lib/ai";
import { useDataHub } from "@/lib/data";
import {
  ORIGIN_LABEL,
  ROUTE_LABEL,
  type Lead,
  type LeadStatus,
} from "@/lib/demo-data";
import type { Lang } from "@/lib/i18n";
import { useNotifications } from "@/lib/notifications";
import { showMobileSuccess } from "@/lib/mobile-confirm";
import { cn } from "@/lib/utils";
import {
  MobileCard,
  MobileChip,
  MobileFilterRow,
  MobileKv,
  MobileRing,
  MobileScreenTitle,
  type MobileTone,
} from "@/components/MobileBits";
import { MobileSheet } from "@/components/MobileSheet";
import { ChevronRight, Loader2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

const STATUS_LABEL: Record<LeadStatus, { es: string; en: string; tone: MobileTone }> = {
  nuevo: { es: "Nuevo", en: "New", tone: "neutral" },
  en_contacto: { es: "En contacto", en: "In contact", tone: "accent" },
  cualificado: { es: "Cualificado", en: "Qualified", tone: "ok" },
  reservado: { es: "Reservado", en: "Booked", tone: "ok" },
  descartado: { es: "Descartado", en: "Dropped", tone: "danger" },
};

const STATUS_ORDER: LeadStatus[] = [
  "nuevo",
  "en_contacto",
  "cualificado",
  "reservado",
  "descartado",
];

type LeadFilter = "all" | LeadStatus;

function scoreTone(score: number): MobileTone {
  if (score >= 85) return "ok";
  if (score >= 65) return "accent";
  if (score >= 45) return "warn";
  return "danger";
}

function daysAgo(iso: string, es: boolean): string {
  const then = new Date(`${iso}T00:00:00`).getTime();
  if (Number.isNaN(then)) return iso;
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days === 0) return es ? "hoy" : "today";
  if (days === 1) return es ? "ayer" : "yesterday";
  return es ? `hace ${days} días` : `${days} days ago`;
}

export function MobileLeadsScreen({ lang }: { lang: Lang }) {
  const hub = useDataHub();
  const { push } = useNotifications();
  const es = lang === "es";
  const [filter, setFilter] = useState<LeadFilter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [scoring, setScoring] = useState(false);

  const list = useMemo(
    () =>
      hub.leads
        .filter((l) => filter === "all" || l.status === filter)
        .sort((a, b) => b.score - a.score),
    [hub.leads, filter],
  );

  const filters: { id: LeadFilter; label: string }[] = [
    { id: "all", label: es ? "Todos" : "All" },
    { id: "nuevo", label: es ? "Nuevos" : "New" },
    { id: "en_contacto", label: es ? "En contacto" : "In contact" },
    { id: "cualificado", label: es ? "Cualificados" : "Qualified" },
    { id: "reservado", label: es ? "Reservados" : "Booked" },
  ];

  const open = hub.leads.find((l) => l.id === openId) ?? null;

  async function changeStatus(lead: Lead, status: LeadStatus) {
    if (lead.status === status) return;
    await hub.saveLead({
      ...lead,
      status,
      lastTouchAt: new Date().toISOString().slice(0, 10),
    });
  }

  /** Mismo camino que el escritorio: scoring del repo (Ollama si está, si no heurística). */
  async function runScore(lead: Lead) {
    if (scoring) return;
    setScoring(true);
    try {
      const linked =
        hub.clients.find((c) => c.email.toLowerCase() === lead.email.toLowerCase()) ?? null;
      const result = await scoreLead(lead, linked);
      await hub.saveLead(applyScoreToLead(lead, result));
      push({
        kind: "lead",
        tone: result.score >= 80 ? "ok" : "info",
        actor: lead.name,
        statusLabel: es ? "SCORE IA" : "AI SCORE",
        body: `Lead score ${result.score}/100 · ${priorityLabel(result.priority, lang)}`,
        detail: result.reasons.slice(0, 3).join(" · "),
        section: "leads",
        entityId: lead.id,
      });
      showMobileSuccess({
        title: es ? "Scoring actualizado" : "Scoring updated",
        description: `${lead.name} · ${result.score}/100 · ${
          es ? "nadie ha sido contactado" : "nobody was contacted"
        }`,
      });
    } finally {
      setScoring(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <MobileScreenTitle
        title="Leads"
        subtitle={
          es
            ? "Cola priorizada por scoring. Tú decides quién recibe la llamada."
            : "Queue ranked by scoring. You decide who gets the call."
        }
      />

      <MobileFilterRow options={filters} value={filter} onChange={setFilter} />

      <div className="flex flex-col gap-2.5">
        {list.length === 0 ? (
          <MobileCard>
            <p className="px-4 py-8 text-center text-[13px] text-[var(--ink-muted)]">
              {es ? "No hay leads con ese filtro." : "No leads with that filter."}
            </p>
          </MobileCard>
        ) : (
          list.map((lead) => {
            const status = STATUS_LABEL[lead.status];
            return (
              <button
                key={lead.id}
                type="button"
                onClick={() => setOpenId(lead.id)}
                className="flex w-full items-center gap-3 rounded-[1.25rem] border border-[color-mix(in_oklab,var(--ink)_8%,transparent)] bg-[var(--glass-strong)] p-3.5 text-left shadow-sm"
              >
                <MobileRing
                  value={lead.score}
                  tone={scoreTone(lead.score)}
                  size={46}
                  label={`Score ${lead.score}`}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold text-[var(--ink)]">
                    {lead.name}
                  </span>
                  <span className="block truncate text-xs text-[var(--ink-muted)]">
                    {lead.interestRoute
                      ? ROUTE_LABEL[lead.interestRoute]
                      : es
                        ? "Ruta por definir"
                        : "Route to define"}
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5">
                    <MobileChip tone={status.tone}>{es ? status.es : status.en}</MobileChip>
                    <MobileChip>{ORIGIN_LABEL[lead.origin]}</MobileChip>
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="text-[11px] text-[var(--ink-muted)]">
                    {daysAgo(lead.lastTouchAt || lead.createdAt, es)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[var(--ink-muted)]" />
                </span>
              </button>
            );
          })
        )}
      </div>

      <div className="flex gap-2.5 rounded-[1.15rem] border border-[color-mix(in_oklab,var(--accent)_24%,transparent)] bg-[color-mix(in_oklab,var(--accent)_8%,var(--glass-strong))] p-3.5">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
        <p className="text-[12.5px] leading-relaxed text-[var(--ink)]">
          {es ? (
            <>
              <b className="font-semibold">Regla de oro:</b> el scoring prioriza la cola,
              pero el primer mensaje lo escribe siempre una persona del equipo.
            </>
          ) : (
            <>
              <b className="font-semibold">Golden rule:</b> scoring ranks the queue, but the
              first message is always written by a human.
            </>
          )}
        </p>
      </div>

      <MobileSheet
        open={Boolean(open)}
        title={es ? "Ficha de lead" : "Lead profile"}
        onClose={() => setOpenId(null)}
      >
        {open && (
          <>
            <MobileCard className="flex items-center gap-3.5 p-4">
              <MobileRing
                value={open.score}
                tone={scoreTone(open.score)}
                size={62}
                label={`Score ${open.score}`}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-bold tracking-tight text-[var(--ink)]">
                  {open.name}
                </span>
                <span className="block truncate text-xs text-[var(--ink-muted)]">
                  {open.id} · {es ? "Resp." : "Owner"} {open.owner}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  <MobileChip tone={STATUS_LABEL[open.status].tone}>
                    {es ? STATUS_LABEL[open.status].es : STATUS_LABEL[open.status].en}
                  </MobileChip>
                  <MobileChip tone={scoreTone(open.score)}>
                    {priorityLabel(priorityFromScore(open.score), lang)}
                  </MobileChip>
                </span>
              </span>
            </MobileCard>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={scoring}
                onClick={() => void runScore(open)}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] text-sm font-bold text-white shadow-[0_8px_20px_color-mix(in_oklab,var(--accent)_34%,transparent)] disabled:opacity-60"
              >
                {scoring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {es ? "Clasificar con IA" : "Score with AI"}
              </button>
              <a
                href={`mailto:${open.email}`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[var(--glass-strong)] text-sm font-bold text-[var(--ink)]"
              >
                <Mail className="h-4 w-4" />
                Email
              </a>
            </div>

            <MobileCard className="divide-y divide-[color-mix(in_oklab,var(--ink)_8%,transparent)]">
              <MobileKv
                label={es ? "Ruta de interés" : "Route of interest"}
                value={open.interestRoute ? ROUTE_LABEL[open.interestRoute] : "—"}
              />
              <MobileKv
                label={es ? "Vehículo" : "Vehicle"}
                value={open.vehicle ? (open.vehicle === "moto" ? "Moto" : "4x4") : "—"}
              />
              <MobileKv label={es ? "Origen" : "Source"} value={ORIGIN_LABEL[open.origin]} />
              <MobileKv label={es ? "Campaña" : "Campaign"} value={open.campaign ?? "—"} />
              <MobileKv label="Email" value={open.email} />
              <MobileKv label={es ? "Entró" : "Created"} value={open.createdAt} />
              <MobileKv
                label={es ? "Último contacto" : "Last touch"}
                value={open.lastTouchAt || "—"}
              />
            </MobileCard>

            {open.scoreReasons.length > 0 && (
              <section className="flex flex-col gap-2">
                <h3 className="px-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                  {es ? "Por qué esta puntuación" : "Why this score"}
                </h3>
                <MobileCard className="flex flex-col gap-2.5 p-4">
                  {open.scoreReasons.map((reason) => (
                    <p
                      key={reason}
                      className="flex gap-2.5 text-[13px] leading-snug text-[var(--ink)]"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      {reason}
                    </p>
                  ))}
                </MobileCard>
              </section>
            )}

            <section className="flex flex-col gap-2">
              <h3 className="px-1 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--ink-muted)]">
                {es ? "Estado del lead" : "Lead status"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={open.status === s}
                    onClick={() => void changeStatus(open, s)}
                    className={cn(
                      "min-h-10 rounded-full border px-3.5 text-[12.5px] font-semibold transition",
                      open.status === s
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[color-mix(in_oklab,var(--ink)_10%,transparent)] bg-[var(--glass-strong)] text-[var(--ink)]",
                    )}
                  >
                    {es ? STATUS_LABEL[s].es : STATUS_LABEL[s].en}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </MobileSheet>
    </div>
  );
}
