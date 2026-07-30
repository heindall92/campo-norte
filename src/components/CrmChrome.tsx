/**
 * Card / Badge compartidos del CRM (extraídos de MpsCrmApp para paneles independientes).
 */
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad" | "brand";
}) {
  const tones = {
    neutral: "bg-[var(--glass)] text-[var(--ink)] border-[var(--glass-border)]",
    good: "bg-[color-mix(in_oklab,var(--ok)_18%,transparent)] text-[var(--ok)] border-[color-mix(in_oklab,var(--ok)_35%,transparent)]",
    warn: "bg-[var(--warn-bg)] text-[var(--warn-ink)] border-[color-mix(in_oklab,var(--warn-ink)_30%,transparent)]",
    bad: "bg-[color-mix(in_oklab,var(--danger)_18%,transparent)] text-[var(--danger)] border-[color-mix(in_oklab,var(--danger)_35%,transparent)]",
    brand:
      "bg-[color-mix(in_oklab,var(--accent)_18%,transparent)] text-[var(--accent)] border-[color-mix(in_oklab,var(--accent)_40%,transparent)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function Card({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "glass-panel rounded-2xl border border-[var(--glass-border)] p-4 md:p-5",
        className,
      )}
    >
      {(title || subtitle) && (
        <header className="mb-3">
          {title && (
            <h3 className="font-[family-name:var(--mps-display)] text-lg text-[var(--ink)] md:text-xl">
              {title}
            </h3>
          )}
          {subtitle && <p className="mt-0.5 text-sm text-[var(--ink-muted)]">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
