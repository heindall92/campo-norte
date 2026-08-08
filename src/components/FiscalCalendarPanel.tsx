import { useMemo } from "react";

import { StatusBadge, type StatusTone } from "@/components/ui/StatusBadge";
import { formatDate, formatEur } from "@/lib/format";
import { buildFiscalCalendar, upcomingDeadlines } from "@/lib/fiscal-calendar";
import type { Lang } from "@/lib/i18n";
import type { Invoice } from "@/lib/ops-data";
import { cn } from "@/lib/utils";

interface FiscalCalendarPanelProps {
  invoices?: Invoice[];
  lang?: Lang;
  now?: Date;
  className?: string;
}

function toneFor(days: number): { tone: StatusTone; label: string } {
  if (days < 0) return { tone: "negative", label: "Vencido" };
  if (days <= 15) return { tone: "warning", label: "Próximo" };
  return { tone: "info", label: "Programado" };
}

/**
 * Calendario fiscal con importe estimado.
 *
 * El importe se calcula desde las facturas del Hub, así que se etiqueta
 * siempre como estimación y se muestra la base del cálculo. Los modelos que
 * dependen de nóminas o de contabilidad completa se listan sin cifra: un
 * hueco honesto es mejor que un número inventado en algo que se presenta
 * ante Hacienda.
 */
export function FiscalCalendarPanel({
  invoices,
  lang = "es",
  now,
  className,
}: FiscalCalendarPanelProps) {
  const deadlines = useMemo(
    () => upcomingDeadlines(buildFiscalCalendar({ invoices, now })),
    [invoices, now],
  );

  const overdue = deadlines.filter((d) => d.daysToDue < 0).length;

  return (
    <section className={cn("glass-panel rounded-2xl p-5", className)}>
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Calendario fiscal
          </h3>
          {overdue > 0 ? <StatusBadge tone="negative">{overdue} vencidos</StatusBadge> : null}
        </div>
        <p className="mt-0.5 text-sm" style={{ color: "var(--text-secondary)" }}>
          Vencimientos AEAT ordenados por urgencia. Los importes son
          <strong> estimaciones</strong> a partir de tus facturas, no autoliquidaciones.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="mps-table">
          <thead>
            <tr>
              <th scope="col">Modelo</th>
              <th scope="col">Periodo</th>
              <th scope="col">Vence</th>
              <th scope="col">Estado</th>
              <th scope="col" className="mps-num">
                Estimado
              </th>
            </tr>
          </thead>
          <tbody>
            {deadlines.map((d) => {
              const { tone, label } = toneFor(d.daysToDue);
              return (
                <tr key={d.id}>
                  <td>
                    <span className="block font-semibold" style={{ color: "var(--text-primary)" }}>
                      Modelo {d.model}
                    </span>
                    <span className="block text-xs" style={{ color: "var(--text-tertiary)" }}>
                      {d.title}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{d.period}</td>
                  <td className="whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>
                    {formatDate(d.dueAt, lang)}
                  </td>
                  <td>
                    <StatusBadge tone={tone}>{label}</StatusBadge>
                  </td>
                  <td className="mps-num" title={d.basis ?? undefined}>
                    {d.estimated == null ? (
                      <span style={{ color: "var(--text-tertiary)" }} title="Requiere nóminas o contabilidad completa">
                        —
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-primary)" }}>
                        ≈ {formatEur(d.estimated, lang)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[0.68rem]" style={{ color: "var(--text-tertiary)" }}>
        Fechas ordinarias; no se modelan festivos autonómicos ni prórrogas. Un guion significa que
        el dato no está en el sistema, no que el importe sea cero. Esto no sustituye a tu gestoría.
      </p>
    </section>
  );
}
