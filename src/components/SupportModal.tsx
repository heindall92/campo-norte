"use client";

import { COMPANY, GOLDEN_RULE } from "@/lib/assumptions";
import type { Lang } from "@/lib/i18n";
import { BookOpen, CircleHelp, ExternalLink, X } from "lucide-react";

export function SupportModal({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
}) {
  if (!open) return null;

  const es = lang === "es";
  const bullets = es
    ? [
        ["Hub / Dashboard", "KPIs y datos vivos del equipo."],
        ["Leads · Clientes", "Clasificación humana + IA interna. Nada escribe al viajero."],
        ["WhatsApp", "Solo desde el número de negocio confirmado."],
        ["Roles", "Cada sesión ve solo las secciones de su rol."],
        ["Licencia", "Uso interno autorizado. Sin redistribución ni copia sin licencia vigente."],
      ]
    : [
        ["Hub / Dashboard", "Live team KPIs and data."],
        ["Leads · Clients", "Human ranking + internal AI. Nothing writes to travellers."],
        ["WhatsApp", "Only from the confirmed business number."],
        ["Roles", "Each session only sees its allowed sections."],
        ["License", "Authorized internal use. No redistribution without a valid license."],
      ];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[color-mix(in_oklab,#020617_55%,transparent)] p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(85dvh,40rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-[color-mix(in_oklab,var(--accent)_45%,var(--glass-border))] bg-[var(--glass-strong)] p-5 shadow-[0_0_40px_color-mix(in_oklab,var(--accent)_25%,transparent)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[var(--accent)]">
              <CircleHelp className="h-5 w-5" />
            </span>
            <h2
              id="support-modal-title"
              className="text-lg font-bold text-[var(--ink)]"
            >
              {es ? "Soporte" : "Support"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--glass-border)] p-2 text-[var(--ink-muted)] hover:text-[var(--ink)]"
            aria-label={es ? "Cerrar" : "Close"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--ink-muted)] text-pretty">
          <p>
            {es
              ? `${COMPANY.name} Growth OS es el CRM interno del equipo. La tecnología clasifica y prioriza; nunca escribe al viajero. Cumple uso interno con autenticación y tratamiento de datos alineado a RGPD / LOPDGDD.`
              : `${COMPANY.name} Growth OS is the internal team CRM. Tech ranks and prioritizes; it never messages travellers. Internal authenticated use with GDPR-aligned data handling.`}
          </p>
          <p>
            {es
              ? `Licencia comercial de uso interno para el equipo autorizado de ${COMPANY.legal}. Queda prohibida la copia, cesión o redistribución del software sin licencia vigente. Para configuración o incidencias, contacta a ${COMPANY.ceo} (${COMPANY.ceoTitle}) o al Admin.`
              : `Commercial internal-use license for the authorized ${COMPANY.legal} team. Copying, transfer or redistribution without a valid license is forbidden. For setup or incidents, contact ${COMPANY.ceo} (${COMPANY.ceoTitle}) or Admin.`}
          </p>
          <p className="text-xs italic text-[var(--ink)]">{GOLDEN_RULE}</p>
        </div>

        <div className="mt-5 grid gap-2">
          <a
            href={COMPANY.website}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl border border-[color-mix(in_oklab,var(--accent)_40%,var(--glass-border))] px-4 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
          >
            <span>{es ? "Web · 30 MPS" : "Website · 30 MPS"}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="/legal#aviso"
            className="flex items-center justify-between rounded-xl border border-[color-mix(in_oklab,var(--accent)_40%,var(--glass-border))] px-4 py-3 text-sm font-semibold text-[var(--accent)] transition hover:bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
          >
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {es ? "Licencia y aviso legal" : "License & legal notice"}
            </span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <ul className="mt-5 space-y-2.5 text-sm text-[var(--ink)]">
          {bullets.map(([title, detail]) => (
            <li key={title} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>
                <strong>{title}:</strong>{" "}
                <span className="text-[var(--ink-muted)]">{detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-5 border-t border-[var(--glass-border)] pt-3 text-center text-[11px] text-[var(--ink-muted)]">
          {es
            ? "30 MPS · Growth OS · Licencia interna · Documentación en línea"
            : "30 MPS · Growth OS · Internal license · Online docs"}
        </p>
      </div>
    </div>
  );
}
