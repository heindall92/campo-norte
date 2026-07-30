import { COMPANY, GOLDEN_RULE, MPS_ANNEX, MPS_ASSUMPTIONS, TEAM } from "@/lib/assumptions";
import {
  EXPERIENCE_LABEL,
  KNOWLEDGE_ANSWERS,
  type KnowledgeItem,
  MONTHLY_KPIS,
  ORIGIN_LABEL,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  ROUTE_LABEL,
  SEGMENT_LABEL,
  STATUS_LABEL,
  progressToMillion,
  routeMargins,
  type Client,
  type Lead,
  type LeadOrigin,
  type LeadStatus,
  type VehicleMode,
} from "@/lib/demo-data";
import {
  blankLead,
  computeLeadStats,
  computeOriginFromLeads,
  downloadTextFile,
  supabaseConfigured,
  useDataHub,
} from "@/lib/data";
import { SLIDES, t, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  AutomationsEcosystemPanel,
  InvoicesVerifactuPanel,
  ReservationsPanel,
  clientPaymentTone,
} from "@/components/OpsPanels";
import { blankClient, ClientFormModal } from "@/components/ClientFormModal";
import { ContentFactoryPanel } from "@/components/ContentFactoryPanel";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Bike,
  BookOpen,
  Car,
  ClipboardList,
  Cloud,
  Database,
  Download,
  FileText,
  Gauge,
  HardDrive,
  LayoutDashboard,
  Lightbulb,
  Mail,
  MessageSquareWarning,
  Moon,
  Pencil,
  Phone,
  Plus,
  Presentation,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Target,
  Upload,
  Users,
  Workflow,
  CalendarDays,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Theme = "light" | "dark";
type Section =
  | "hub"
  | "dashboard"
  | "leads"
  | "clientes"
  | "reservas"
  | "facturas"
  | "contenido"
  | "conocimiento"
  | "automatizaciones"
  | "propuesta"
  | "slides";

const NAV_IDS: { id: Section; icon: typeof LayoutDashboard; labelKey: string }[] = [
  { id: "hub", icon: Database, labelKey: "nav_hub" },
  { id: "dashboard", icon: LayoutDashboard, labelKey: "nav_dashboard" },
  { id: "leads", icon: Gauge, labelKey: "nav_leads" },
  { id: "clientes", icon: Users, labelKey: "nav_clients" },
  { id: "reservas", icon: CalendarDays, labelKey: "nav_reservations" },
  { id: "facturas", icon: FileText, labelKey: "nav_invoices" },
  { id: "contenido", icon: Sparkles, labelKey: "nav_content" },
  { id: "conocimiento", icon: BookOpen, labelKey: "nav_knowledge" },
  { id: "automatizaciones", icon: Workflow, labelKey: "nav_automations" },
  { id: "propuesta", icon: ClipboardList, labelKey: "nav_pitch" },
  { id: "slides", icon: Presentation, labelKey: "nav_slides" },
];

const ORIGIN_COLORS_LIGHT: Record<LeadOrigin, string> = {
  web_form: "#0f766e",
  instagram: "#0369a1",
  referral: "#0f172a",
  brevo_click: "#b45309",
  feria: "#047857",
  unknown: "#94a3b8",
};

const ORIGIN_COLORS_DARK: Record<LeadOrigin, string> = {
  web_form: "#2dd4bf",
  instagram: "#38bdf8",
  referral: "#e2e8f0",
  brevo_click: "#fbbf24",
  feria: "#34d399",
  unknown: "#64748b",
};

function euro(n: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "en" ? "en-GB" : "es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

function Badge({
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

function Card({
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
    <section className={cn("glass-panel rounded-2xl p-5", className)}>
      {(title || subtitle) && (
        <header className="mb-4">
          {title && (
            <h3 className="font-[family-name:var(--mps-display)] text-lg text-[var(--ink)]">
              {title}
            </h3>
          )}
          {subtitle && <p className="mt-1 text-sm text-[var(--ink-muted)]">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4 backdrop-blur-md">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">{label}</p>
      <p className="mt-2 font-[family-name:var(--mps-display)] text-2xl text-[var(--ink)] md:text-3xl">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--ink-muted)]">{hint}</p>}
    </div>
  );
}

function VehicleBadge({ vehicle }: { vehicle: VehicleMode | null }) {
  if (!vehicle) return <Badge>——</Badge>;
  return (
    <Badge tone="brand">
      {vehicle === "moto" ? <Bike className="mr-1 h-3 w-3" /> : <Car className="mr-1 h-3 w-3" />}
      {vehicle === "moto" ? "Moto" : "4x4"}
    </Badge>
  );
}

function scoreTone(score: number): "good" | "warn" | "bad" | "neutral" {
  if (score >= 80) return "good";
  if (score >= 60) return "warn";
  if (score >= 40) return "neutral";
  return "bad";
}

function HubPanel({ lang }: { lang: Lang }) {
  const hub = useDataHub();
  const { sorted } = computeLeadStats(hub.leads);
  const leadsFileRef = useRef<HTMLInputElement>(null);
  const clientsFileRef = useRef<HTMLInputElement>(null);
  const snapshotFileRef = useRef<HTMLInputElement>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const fields =
    lang === "es"
      ? [
          "ID",
          "Nombre",
          "NIF/DNI",
          "Origen",
          "Campaña",
          "Destino",
          "Moto/4x4",
          "Estado",
          "Score",
          "Pago (Stripe/Bizum/SEPA…)",
          "Reserva / logística",
          "Factura REAV 05",
          "Responsable",
        ]
      : [
          "ID",
          "Name",
          "Tax ID",
          "Origin",
          "Campaign",
          "Destination",
          "Moto/4x4",
          "Status",
          "Score",
          "Payment (Stripe/Bizum/SEPA…)",
          "Booking / logistics",
          "REAV 05 invoice",
          "Owner",
        ];

  async function onCsvFile(
    file: File | undefined,
    kind: "leads" | "clients",
  ) {
    if (!file) return;
    const text = await file.text();
    const result =
      kind === "leads" ? await hub.importLeadsCsv(text) : await hub.importClientsCsv(text);
    const msg =
      lang === "es"
        ? `Importados ${result.added} · actualizados ${result.updated}${result.errors.length ? ` · ${result.errors.length} avisos` : ""}`
        : `Added ${result.added} · updated ${result.updated}${result.errors.length ? ` · ${result.errors.length} warnings` : ""}`;
    setFlash(msg);
  }

  return (
    <div className="space-y-5">
      <Card title={t(lang, "hub_title")} subtitle={t(lang, "hub_sub")}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone={hub.mode === "supabase" ? "good" : "brand"}>
            {hub.mode === "supabase" ? (
              <span className="inline-flex items-center gap-1">
                <Cloud className="h-3 w-3" /> Postgres / Supabase
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <HardDrive className="h-3 w-3" /> Local · persistente
              </span>
            )}
          </Badge>
          {hub.meta?.seededFromDemo ? (
            <Badge tone="warn">
              {lang === "es" ? "Semilla demo (editable)" : "Demo seed (editable)"}
            </Badge>
          ) : (
            <Badge tone="good">
              {lang === "es" ? "Datos operativos" : "Operational data"}
            </Badge>
          )}
          <Badge>
            {hub.leads.length} leads · {hub.clients.length}{" "}
            {lang === "es" ? "clientes" : "clients"} · {hub.reservations.length}{" "}
            {lang === "es" ? "reservas" : "bookings"}
          </Badge>
          {hub.meta?.updatedAt && (
            <Badge tone="neutral">
              Sync {new Date(hub.meta.updatedAt).toLocaleString(lang === "en" ? "en-GB" : "es-ES")}
            </Badge>
          )}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {fields.map((f) => (
            <Badge key={f} tone="brand">
              {f}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-[var(--ink-muted)]">
          {lang === "es"
            ? "Fase 1 activa: CRM conectado al Data Hub. Los cambios en leads, clientes, reservas y facturas se guardan. Importa Excel/CSV o conecta Supabase (Postgres) con .env.local."
            : "Phase 1 live: CRM wired to the Data Hub. Lead, client, booking and invoice edits persist. Import Excel/CSV or connect Supabase (Postgres) via .env.local."}
        </p>

        {hub.error && (
          <div className="mt-3 rounded-xl border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] bg-[color-mix(in_oklab,var(--danger)_10%,transparent)] px-3 py-2 text-sm text-[var(--danger)]">
            {hub.error}
            <button type="button" className="ml-2 underline" onClick={hub.clearError}>
              OK
            </button>
          </div>
        )}
        {flash && (
          <div className="mt-3 rounded-xl border border-[color-mix(in_oklab,var(--ok)_35%,transparent)] bg-[color-mix(in_oklab,var(--ok)_10%,transparent)] px-3 py-2 text-sm text-[var(--ok)]">
            {flash}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => leadsFileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
          >
            <Upload className="h-4 w-4" />
            {lang === "es" ? "Importar leads CSV" : "Import leads CSV"}
          </button>
          <button
            type="button"
            onClick={() => clientsFileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            <Upload className="h-4 w-4" />
            {lang === "es" ? "Importar clientes CSV" : "Import clients CSV"}
          </button>
          <button
            type="button"
            onClick={() =>
              downloadTextFile(
                `30mps-leads-${new Date().toISOString().slice(0, 10)}.csv`,
                hub.getLeadsCsv(),
                "text/csv;charset=utf-8",
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            <Download className="h-4 w-4" />
            CSV leads
          </button>
          <button
            type="button"
            onClick={() =>
              downloadTextFile(
                `30mps-clients-${new Date().toISOString().slice(0, 10)}.csv`,
                hub.getClientsCsv(),
                "text/csv;charset=utf-8",
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            <Download className="h-4 w-4" />
            CSV clientes
          </button>
          <button
            type="button"
            onClick={() =>
              downloadTextFile(
                `30mps-hub-backup-${new Date().toISOString().slice(0, 10)}.json`,
                JSON.stringify(hub.exportSnapshot(), null, 2),
                "application/json",
              )
            }
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            <Download className="h-4 w-4" />
            Backup JSON
          </button>
          <button
            type="button"
            onClick={() => snapshotFileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            <Upload className="h-4 w-4" />
            Restaurar JSON
          </button>
          <button
            type="button"
            onClick={() => void hub.refresh()}
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
          >
            <RefreshCw className="h-4 w-4" />
            {lang === "es" ? "Recargar" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={() => {
              const ok = window.confirm(
                lang === "es"
                  ? "¿Restablecer a la semilla demo? Se perderán los datos operativos de este Hub."
                  : "Reset to demo seed? Operational Hub data will be lost.",
              );
              if (ok) void hub.resetToSeed();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-[color-mix(in_oklab,var(--danger)_35%,transparent)] px-3 py-2 text-sm font-semibold text-[var(--danger)]"
          >
            {lang === "es" ? "Reset semilla" : "Reset seed"}
          </button>
        </div>

        <input
          ref={leadsFileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            void onCsvFile(e.target.files?.[0], "leads");
            e.target.value = "";
          }}
        />
        <input
          ref={clientsFileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            void onCsvFile(e.target.files?.[0], "clients");
            e.target.value = "";
          }}
        />
        <input
          ref={snapshotFileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            void file.text().then(async (text) => {
              await hub.importSnapshotJson(text);
              setFlash(lang === "es" ? "Snapshot restaurado" : "Snapshot restored");
            });
            e.target.value = "";
          }}
        />

        <div className="mt-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-3 text-sm text-[var(--ink-muted)]">
          <p className="font-semibold text-[var(--ink)]">
            {lang === "es" ? "Conectar Postgres (Supabase)" : "Connect Postgres (Supabase)"}
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>
              {lang === "es" ? "Ejecuta" : "Run"} <code className="text-[var(--accent)]">supabase/schema.sql</code>
            </li>
            <li>
              {lang === "es" ? "Copia" : "Copy"} <code className="text-[var(--accent)]">.env.example</code> →{" "}
              <code className="text-[var(--accent)]">.env.local</code>
            </li>
            <li>
              VITE_DATA_MODE=supabase · VITE_SUPABASE_URL · VITE_SUPABASE_ANON_KEY
              {supabaseConfigured()
                ? lang === "es"
                  ? " (credenciales detectadas)"
                  : " (credentials detected)"
                : lang === "es"
                  ? " (aún no configurado)"
                  : " (not configured yet)"}
            </li>
            <li>
              {lang === "es"
                ? "Plantillas CSV en /templates/leads-import.csv y clients-import.csv"
                : "CSV templates at /templates/leads-import.csv and clients-import.csv"}
            </li>
          </ol>
        </div>
      </Card>

      <Card
        title={lang === "es" ? "Fichas del Hub" : "Hub records"}
        subtitle={
          lang === "es"
            ? "Memoria única viva — misma fuente que Lead Intelligence"
            : "Live single memory — same source as Lead Intelligence"
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm text-[var(--ink)]">
            <thead className="text-xs uppercase tracking-wide text-[var(--ink-muted)]">
              <tr>
                <th className="py-2">ID</th>
                <th>{lang === "es" ? "Nombre" : "Name"}</th>
                <th>{lang === "es" ? "Origen" : "Origin"}</th>
                <th>{lang === "es" ? "Destino" : "Destination"}</th>
                <th>{t(lang, "vehicle")}</th>
                <th>Score</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((l) => (
                <tr key={l.id} className="border-t border-[var(--glass-border)]">
                  <td className="py-2.5 font-mono text-xs">{l.id}</td>
                  <td className="font-medium">{l.name}</td>
                  <td>{ORIGIN_LABEL[l.origin]}</td>
                  <td>{l.interestRoute ? ROUTE_LABEL[l.interestRoute] : "—"}</td>
                  <td>
                    <VehicleBadge vehicle={l.vehicle} />
                  </td>
                  <td>
                    <Badge tone={scoreTone(l.score)}>{l.score}</Badge>
                  </td>
                  <td>{l.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function DashboardPanel({ lang, theme }: { lang: Lang; theme: Theme }) {
  const { leads } = useDataHub();
  const margins = routeMargins();
  const origins = computeOriginFromLeads(leads);
  const progress = progressToMillion();
  const colors = theme === "dark" ? ORIGIN_COLORS_DARK : ORIGIN_COLORS_LIGHT;
  const chart = theme === "dark" ? "#2dd4bf" : "#0f766e";
  const chart2 = theme === "dark" ? "#38bdf8" : "#0369a1";
  const grid = theme === "dark" ? "#334155" : "#e2e8f0";
  const tick = theme === "dark" ? "#94a3b8" : "#64748b";
  const chartRevenue = MONTHLY_KPIS.map((m) => ({
    month: m.month,
    revenue: m.revenue,
    attributedPct: m.attributedPct,
  }));

  return (
    <div className="space-y-5">
      <div className="glass-panel rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
          {t(lang, "nav_dashboard")}
        </p>
        <h2 className="mt-2 font-[family-name:var(--mps-display)] text-3xl text-[var(--ink)] md:text-4xl">
          {t(lang, "dash_title", {
            from: euro(MPS_ANNEX.revenueCurrent, lang),
            to: euro(MPS_ANNEX.revenueTarget2027, lang),
          })}
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-[var(--ink-muted)] md:text-base">
          {t(lang, "dash_sub")}
        </p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--ink)_12%,transparent)]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, Math.round((MPS_ANNEX.revenueCurrent / MPS_ANNEX.revenueTarget2027) * 100))}%`,
              background: `linear-gradient(90deg, ${chart}, ${chart2})`,
            }}
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label={t(lang, "ytd")} value={euro(progress.ytd, lang)} />
          <Kpi label={t(lang, "pace")} value={euro(progress.pace, lang)} hint="YTD × 12/7" />
          <Kpi label={t(lang, "gap")} value={euro(progress.gap, lang)} />
          <Kpi
            label={t(lang, "travelers")}
            value={`${MPS_ANNEX.travelersCurrent}→${MPS_ANNEX.travelersTarget} · ${MPS_ANNEX.departuresCurrent}→${MPS_ANNEX.departuresTarget}`}
          />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card
          title={t(lang, "revenue_attr")}
          subtitle={t(lang, "revenue_attr_sub")}
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartRevenue}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chart} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={chart} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={grid} strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: tick, fontSize: 12 }} />
                <YAxis tick={{ fill: tick, fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) =>
                    name === "revenue"
                      ? euro(Number(value ?? 0), lang)
                      : `${Number(value ?? 0)}%`
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={chart}
                  fill="url(#rev)"
                  name="revenue"
                />
                <Area
                  type="monotone"
                  dataKey="attributedPct"
                  stroke={chart2}
                  fillOpacity={0}
                  name="attributedPct"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title={t(lang, "origin_title")} subtitle={t(lang, "origin_sub")}>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={origins}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {origins.map((o) => (
                    <Cell key={o.origin} fill={colors[o.origin]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {origins.map((o) => (
              <li
                key={o.origin}
                className="flex items-center justify-between text-sm text-[var(--ink)]"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: colors[o.origin] }}
                  />
                  {ORIGIN_LABEL[o.origin]}
                </span>
                <span className="font-semibold">{o.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card
        title={t(lang, "margin_title")}
        subtitle={t(lang, "margin_sub", { pct: MPS_ANNEX.marginTargetPct })}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={margins.map((m) => ({
                name: ROUTE_LABEL[m.route].split("·")[0].trim(),
                marginPct: Number(m.marginPct.toFixed(1)),
                occupancy: Number(m.occupancy.toFixed(0)),
              }))}
            >
              <CartesianGrid stroke={grid} strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fill: tick, fontSize: 11 }} />
              <YAxis tick={{ fill: tick, fontSize: 12 }} />
              <Tooltip formatter={(value) => `${Number(value ?? 0)}%`} />
              <Bar dataKey="marginPct" fill={chart} name="Margen %" radius={[6, 6, 0, 0]} />
              <Bar dataKey="occupancy" fill={chart2} name="Ocupación %" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm text-[var(--ink)]">
            <thead className="text-xs uppercase tracking-wide text-[var(--ink-muted)]">
              <tr>
                <th className="py-2">{t(lang, "expedition")}</th>
                <th>{t(lang, "vehicle")}</th>
                <th>{t(lang, "occupancy")}</th>
                <th>{t(lang, "revenue")}</th>
                <th>{t(lang, "margin")}</th>
                <th>{t(lang, "unknown_origin")}</th>
              </tr>
            </thead>
            <tbody>
              {margins.map((m) => (
                <tr key={m.id} className="border-t border-[var(--glass-border)]">
                  <td className="py-2.5 font-medium">{m.name}</td>
                  <td>
                    <VehicleBadge vehicle={m.vehicle} />
                  </td>
                  <td>
                    {m.booked}/{m.seats} ({m.occupancy.toFixed(0)}%)
                  </td>
                  <td>{euro(m.revenue, lang)}</td>
                  <td>
                    <Badge tone={m.marginPct >= 30 ? "good" : "warn"}>
                      {m.marginPct.toFixed(1)}%
                    </Badge>
                  </td>
                  <td>{m.originMix.unknown ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function LeadsPanel({ lang }: { lang: Lang }) {
  const hub = useDataHub();
  const { sorted, unknown, avg, total } = computeLeadStats(hub.leads);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = sorted.find((l) => l.id === selectedId) ?? sorted[0] ?? null;

  useEffect(() => {
    if (selected && selectedId !== selected.id) setSelectedId(selected.id);
  }, [selected, selectedId]);

  const statuses = Object.keys({
    nuevo: 1,
    en_contacto: 1,
    cualificado: 1,
    reservado: 1,
    descartado: 1,
  }) as LeadStatus[];

  async function patchSelected(patch: Partial<Lead>) {
    if (!selected) return;
    await hub.saveLead({
      ...selected,
      ...patch,
      lastTouchAt: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi label={t(lang, "leads_queue")} value={String(total)} />
        <Kpi label={t(lang, "score_avg")} value={String(avg)} />
        <Kpi label={t(lang, "without_origin")} value={String(unknown)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={async () => {
            const lead = blankLead();
            lead.name = lang === "es" ? "Nuevo lead" : "New lead";
            lead.email = `lead-${lead.id.toLowerCase()}@pendiente.local`;
            await hub.saveLead(lead);
            setSelectedId(lead.id);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          {lang === "es" ? "Añadir lead" : "Add lead"}
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-5">
        <Card title={t(lang, "inbox")} subtitle={t(lang, "inbox_sub")} className="lg:col-span-3">
          <ul className="divide-y divide-[var(--glass-border)]">
            {sorted.map((lead) => (
              <li key={lead.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(lead.id)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-lg px-1 py-3 text-left transition hover:bg-[color-mix(in_oklab,var(--accent)_8%,transparent)]",
                    selected?.id === lead.id &&
                      "bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]",
                  )}
                >
                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      {lead.name}{" "}
                      <span className="font-normal text-[var(--ink-muted)]">{lead.id}</span>
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-muted)]">
                      {ORIGIN_LABEL[lead.origin]}
                      <VehicleBadge vehicle={lead.vehicle} />
                    </p>
                  </div>
                  <Badge tone={scoreTone(lead.score)}>{lead.score}</Badge>
                </button>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={t(lang, "detail")} subtitle={t(lang, "detail_sub")} className="lg:col-span-2">
          {selected ? (
            <>
              <p className="font-[family-name:var(--mps-display)] text-xl text-[var(--ink)]">
                {selected.name}
              </p>
              <p className="text-sm text-[var(--ink-muted)]">{selected.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="brand">{ORIGIN_LABEL[selected.origin]}</Badge>
                <Badge>{selected.status}</Badge>
                <Badge>Owner: {selected.owner}</Badge>
                <VehicleBadge vehicle={selected.vehicle} />
              </div>
              <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                {lang === "es" ? "Estado (humano)" : "Status (human)"}
                <select
                  className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-2 text-sm text-[var(--ink)]"
                  value={selected.status}
                  onChange={(e) => void patchSelected({ status: e.target.value as LeadStatus })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                {lang === "es" ? "Origen / UTM" : "Origin / UTM"}
                <select
                  className="mt-1 w-full rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-2 text-sm text-[var(--ink)]"
                  value={selected.origin}
                  onChange={(e) => void patchSelected({ origin: e.target.value as LeadOrigin })}
                >
                  {(Object.keys(ORIGIN_LABEL) as LeadOrigin[]).map((o) => (
                    <option key={o} value={o}>
                      {ORIGIN_LABEL[o]}
                    </option>
                  ))}
                </select>
              </label>
              <ol className="mt-4 list-decimal space-y-2 pl-4 text-sm text-[var(--ink)]">
                {selected.scoreReasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ol>
              <div className="mt-5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-3 text-sm">
                <p className="font-semibold text-[var(--ink)]">{t(lang, "human_action")}</p>
                <p className="mt-1 text-[var(--ink-muted)]">{t(lang, "human_action_body")}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const ok = window.confirm(
                    lang === "es" ? "¿Eliminar este lead del Hub?" : "Delete this lead from the Hub?",
                  );
                  if (ok) void hub.deleteLead(selected.id);
                }}
                className="mt-4 text-xs font-semibold text-[var(--danger)] underline"
              >
                {lang === "es" ? "Eliminar lead" : "Delete lead"}
              </button>
            </>
          ) : (
            <p className="text-sm text-[var(--ink-muted)]">
              {lang === "es" ? "No hay leads en el Hub." : "No leads in the Hub."}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function ClientsPanel({ lang }: { lang: Lang }) {
  const hub = useDataHub();
  const clients = hub.clients;
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: "create" | "edit"; client: Client } | null>(
    null,
  );

  useEffect(() => {
    if (!openId && clients[0]) setOpenId(clients[0].id);
  }, [clients, openId]);

  const list = useMemo(() => {
    const sorted = [...clients].sort((a, b) => b.reactivationPriority - a.reactivationPriority);
    const query = q.trim().toLowerCase();
    if (!query) return sorted;
    return sorted.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        c.dni.toLowerCase().includes(query) ||
        SEGMENT_LABEL[c.segment].toLowerCase().includes(query),
    );
  }, [q, clients]);

  function statusTone(s: Client["status"]): "good" | "warn" | "bad" | "neutral" {
    if (s === "al_dia") return "good";
    if (s === "alta_prioridad") return "bad";
    if (s === "dormido") return "warn";
    return "neutral";
  }

  function segmentTone(s: Client["segment"]): "good" | "warn" | "bad" | "brand" | "neutral" {
    if (s === "vip" || s === "embajador") return "brand";
    if (s === "dormido" || s === "en_riesgo") return "warn";
    if (s === "recurrente" || s === "activo") return "good";
    return "neutral";
  }

  async function saveClient(c: Client) {
    await hub.saveClient(c);
    setOpenId(c.id);
    setModal(null);
  }

  return (
    <div className="space-y-5">
      <Card
        title={t(lang, "reactivation")}
        subtitle={
          lang === "es"
            ? "Ficha 360º: contacto, historial, LTV y segmento. Alta y edición en ventana. Acciones de llamada y WhatsApp para el equipo."
            : "360° record: contact, history, LTV and segment. Create/edit in a dialog. Call and WhatsApp actions for the team."
        }
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={
                lang === "es"
                  ? "Buscar por nombre, email, teléfono, DNI, ciudad o segmento…"
                  : "Search by name, email, phone, tax ID, city or segment…"
              }
              className="w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] py-2.5 pl-10 pr-3 text-sm text-[var(--ink)] outline-none ring-[var(--accent)] placeholder:text-[var(--ink-muted)] focus:ring-2"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">
              {list.length} {lang === "es" ? "clientes" : "clients"}
            </Badge>
            <button
              type="button"
              onClick={() => setModal({ mode: "create", client: blankClient() })}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              {lang === "es" ? "Añadir cliente" : "Add client"}
            </button>
          </div>
        </div>

        <ul className="space-y-3">
          {list.map((c) => {
            const open = openId === c.id;
            return (
              <li
                key={c.id}
                className="overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass)]"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : c.id)}
                  className="flex w-full flex-col gap-3 p-4 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                        {c.name.slice(0, 1) || "?"}
                      </span>
                      <div>
                        <p className="font-semibold text-[var(--ink)]">
                          {c.name || (lang === "es" ? "(Sin nombre)" : "(Untitled)")}{" "}
                          <span className="font-mono text-xs font-normal text-[var(--ink-muted)]">
                            {c.id}
                          </span>
                        </p>
                        <p className="text-xs text-[var(--ink-muted)]">
                          {c.city} · {c.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={segmentTone(c.segment)}>{SEGMENT_LABEL[c.segment]}</Badge>
                    <Badge tone={statusTone(c.status)}>{STATUS_LABEL[c.status]}</Badge>
                    <Badge tone={clientPaymentTone(c.paymentStatus)}>
                      {PAYMENT_STATUS_LABEL[c.paymentStatus]}
                    </Badge>
                    <span className="text-sm font-semibold text-[var(--ink)]">
                      LTV {euro(c.ltv, lang)}
                    </span>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-[var(--glass-border)] px-4 pb-4 pt-3">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_oklab,var(--bg0)_50%,transparent)] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-[var(--ink-muted)]">
                          {lang === "es" ? "Prioridad reactivación" : "Reactivation priority"}
                        </p>
                        <p className="mt-1 font-[family-name:var(--mps-display)] text-2xl text-[var(--ink)]">
                          {c.reactivationPriority}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_oklab,var(--bg0)_50%,transparent)] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-[var(--ink-muted)]">
                          {t(lang, "trips")}
                        </p>
                        <p className="mt-1 font-[family-name:var(--mps-display)] text-2xl text-[var(--ink)]">
                          {c.trips}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_oklab,var(--bg0)_50%,transparent)] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-[var(--ink-muted)]">
                          {lang === "es" ? "Ticket medio" : "Avg. ticket"}
                        </p>
                        <p className="mt-1 font-[family-name:var(--mps-display)] text-2xl text-[var(--ink)]">
                          {euro(c.avgTicket, lang)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_oklab,var(--bg0)_50%,transparent)] p-3">
                        <p className="text-[10px] uppercase tracking-wide text-[var(--ink-muted)]">
                          NPS / Referidos
                        </p>
                        <p className="mt-1 font-[family-name:var(--mps-display)] text-2xl text-[var(--ink)]">
                          {c.nps ?? "—"} / {c.referrals}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="space-y-2 text-sm text-[var(--ink)]">
                        <p>
                          <span className="text-[var(--ink-muted)]">DNI/NIF:</span> {c.dni}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Dirección:" : "Address:"}
                          </span>{" "}
                          {c.address}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">Email:</span> {c.email}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">WhatsApp:</span> {c.phone}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Contacto / emergencia:" : "Contact / emergency:"}
                          </span>{" "}
                          {c.contactPerson} · {c.emergencyPhone}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Ciudad:" : "City:"}
                          </span>{" "}
                          {c.city}, {c.country}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Medio de pago:" : "Payment method:"}
                          </span>{" "}
                          {PAYMENT_METHOD_LABEL[c.paymentMethod]}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Saldo pendiente:" : "Pending balance:"}
                          </span>{" "}
                          {euro(c.pendingBalance, lang)}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Experiencia:" : "Experience:"}
                          </span>{" "}
                          {EXPERIENCE_LABEL[c.experience]} · Docs:{" "}
                          {c.docsComplete ? "OK" : lang === "es" ? "Pendientes" : "Pending"}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">Owner:</span> {c.owner}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Alta:" : "Since:"}
                          </span>{" "}
                          {c.since}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Origen primario:" : "Primary origin:"}
                          </span>{" "}
                          {ORIGIN_LABEL[c.originPrimary]}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">Brevo opens:</span> {c.brevoOpens}
                        </p>
                        <p className="flex flex-wrap items-center gap-2">
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Preferencia:" : "Preference:"}
                          </span>
                          <VehicleBadge vehicle={c.vehiclePref} />
                          {c.preferredRoute ? ROUTE_LABEL[c.preferredRoute] : "—"}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Último viaje:" : "Last trip:"}
                          </span>{" "}
                          {c.lastTripAt ?? "—"}
                        </p>
                        <p>
                          <span className="text-[var(--ink-muted)]">
                            {lang === "es" ? "Interés siguiente:" : "Next interest:"}
                          </span>{" "}
                          {c.nextInterest ? ROUTE_LABEL[c.nextInterest] : "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                          {lang === "es" ? "Historial de expediciones" : "Expedition history"}
                        </p>
                        {c.history.length === 0 ? (
                          <p className="mt-2 text-sm text-[var(--ink-muted)]">
                            {lang === "es" ? "Sin viajes todavía." : "No trips yet."}
                          </p>
                        ) : (
                          <ul className="mt-2 space-y-2">
                            {c.history.map((h) => (
                              <li
                                key={`${h.route}-${h.date}`}
                                className="rounded-lg border border-[var(--glass-border)] px-3 py-2 text-sm text-[var(--ink)]"
                              >
                                <span className="font-medium">{ROUTE_LABEL[h.route]}</span>
                                <span className="text-[var(--ink-muted)]">
                                  {" "}
                                  · {h.date} · {h.vehicle} · {euro(h.amount, lang)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-3 rounded-lg border border-dashed border-[var(--glass-border)] bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] p-3 text-sm text-[var(--ink)]">
                          <strong>{lang === "es" ? "Nota interna:" : "Internal note:"}</strong>{" "}
                          {c.notes}
                        </p>
                        <p className="mt-2 text-sm text-[var(--ink-muted)]">{c.reactivationWhy}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setModal({ mode: "edit", client: { ...c } })}
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
                      >
                        <Pencil className="h-4 w-4" />
                        {lang === "es" ? "Editar datos" : "Edit details"}
                      </button>
                      <a
                        href={`tel:${c.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
                      >
                        <Phone className="h-4 w-4" />
                        {lang === "es" ? "Llamar" : "Call"}
                      </a>
                      <a
                        href={`https://wa.me/${c.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-2 text-sm font-semibold text-[var(--ink)]"
                      >
                        <Mail className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {modal && (
        <ClientFormModal
          lang={lang}
          mode={modal.mode}
          initial={modal.client}
          onClose={() => setModal(null)}
          onSave={saveClient}
        />
      )}
    </div>
  );
}


function KnowledgePanel({ lang }: { lang: Lang }) {
  const [active, setActive] = useState(0);
  const [cat, setCat] = useState<"all" | KnowledgeItem["category"]>("all");
  const filtered =
    cat === "all" ? KNOWLEDGE_ANSWERS : KNOWLEDGE_ANSWERS.filter((k) => k.category === cat);
  const item = filtered[Math.min(active, filtered.length - 1)] ?? filtered[0];

  const cats: { id: typeof cat; label: string }[] = [
    { id: "all", label: lang === "es" ? "Todas" : "All" },
    { id: "ops", label: "Ops" },
    { id: "margen", label: lang === "es" ? "Margen" : "Margin" },
    { id: "clientes", label: lang === "es" ? "Clientes" : "Clients" },
    { id: "legal", label: "Legal" },
    { id: "contenido", label: lang === "es" ? "Contenido" : "Content" },
    { id: "stack", label: "Stack" },
  ];

  return (
    <div className="space-y-4">
      <Card
        title={t(lang, "knowledge_q")}
        subtitle={
          lang === "es"
            ? "RAG interno argumentado: cada respuesta cita fuentes y explica por qué importa al Growth OS. Solo equipo."
            : "Argued internal RAG: every answer cites sources and why it matters to Growth OS. Team only."
        }
      >
        <div className="mb-3 flex flex-wrap gap-1.5">
          {cats.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCat(c.id);
                setActive(0);
              }}
              className={cn(
                "rounded-lg border px-2.5 py-1 text-xs font-semibold",
                cat === c.id
                  ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_14%,transparent)] text-[var(--ink)]"
                  : "border-[var(--glass-border)] text-[var(--ink-muted)]",
              )}
            >
              {c.label}
            </button>
          ))}
          <Badge tone="brand">
            {filtered.length} {lang === "es" ? "preguntas" : "questions"}
          </Badge>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title={lang === "es" ? "Cola de preguntas" : "Question queue"}>
          <ul className="max-h-[520px] space-y-2 overflow-y-auto">
            {filtered.map((k, i) => (
              <li key={k.q}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "w-full rounded-xl border px-3 py-3 text-left text-sm transition",
                    active === i
                      ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                      : "border-[var(--glass-border)] bg-[var(--glass)] text-[var(--ink)] hover:bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]",
                  )}
                >
                  <span className="mb-1 block text-[10px] font-semibold uppercase opacity-80">
                    {k.category}
                  </span>
                  {k.q}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        {item && (
          <Card title={t(lang, "knowledge_a")}>
            <p className="text-sm leading-relaxed text-[var(--ink)]">{item.a}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
              {lang === "es" ? "Por qué importa" : "Why it matters"}
            </p>
            <ul className="mt-2 space-y-2">
              {item.why.map((w) => (
                <li
                  key={w}
                  className="flex gap-2 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-sm text-[var(--ink)]"
                >
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                  {w}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
              {t(lang, "sources")}
            </p>
            <ul className="mt-2 space-y-1">
              {item.sources.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-[var(--ink)]">
                  <BookOpen className="h-4 w-4 text-[var(--accent)]" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-start gap-2 rounded-xl bg-[var(--glass)] p-3 text-xs text-[var(--ink-muted)]">
              <MessageSquareWarning className="mt-0.5 h-4 w-4 shrink-0" />
              {lang === "es"
                ? "Si no hay dato, decir “no está en el sistema” — no inventar. Nunca responde al viajero."
                : "If data is missing, say “not in the system” — never invent. Never answers the traveler."}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

function AutomationsPanel({ lang }: { lang: Lang }) {
  return <AutomationsEcosystemPanel lang={lang} />;
}

function ProposalPanel({ lang }: { lang: Lang }) {
  return (
    <div className="space-y-5">
      <Card>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ink-muted)]">
          Growth OS · {COMPANY.name}
        </p>
        <h2 className="mt-2 font-[family-name:var(--mps-display)] text-3xl text-[var(--ink)]">
          {lang === "es"
            ? "No tres proyectos sueltos — una infraestructura de crecimiento"
            : "Not three loose projects — one growth infrastructure"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ink-muted)] md:text-base">
          {lang === "es" ? (
            <>
              Para <strong className="text-[var(--ink)]">{COMPANY.ceo}</strong>: el CEO no busca
              herramientas aisladas. Busca un sistema que reduzca su dependencia operativa sin
              perder el trato humano. {GOLDEN_RULE}
            </>
          ) : (
            <>
              For <strong className="text-[var(--ink)]">{COMPANY.ceo}</strong>: the CEO doesn’t want
              isolated tools. He wants a system that cuts founder dependency without losing human
              care. {GOLDEN_RULE}
            </>
          )}
        </p>
        <p className="mt-3 text-sm italic text-[var(--accent)]">«{COMPANY.tagline}»</p>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {(lang === "es"
          ? [
              ["F1", "Data Hub + CRM", "Origen del 95% de leads (meta 6 meses)"],
              ["F2–4", "Dashboard + Scoring + CI", "Decidir y priorizar tiempo humano"],
              ["F5–6", "Knowledge + Content", "Menos dependencia + borradores a Brevo/RRSS"],
            ]
          : [
              ["P1", "Data Hub + CRM", "Origin for 95% of leads (6-month goal)"],
              ["P2–4", "Dashboard + Scoring + CI", "Decide and prioritize human time"],
              ["P5–6", "Knowledge + Content", "Less dependency + drafts to Brevo/social"],
            ]
        ).map(([p, title, body]) => (
          <Card key={title}>
            <Badge tone="brand">{p}</Badge>
            <p className="mt-3 font-semibold text-[var(--ink)]">{title}</p>
            <p className="mt-1 text-sm text-[var(--ink-muted)]">{body}</p>
          </Card>
        ))}
      </div>

      <Card title={lang === "es" ? "KPIs de negocio (6 meses)" : "Business KPIs (6 months)"}>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--ink)]">
          {(lang === "es"
            ? [
                "95% leads con origen",
                "−60% tiempo admin. CEO (medir baseline)",
                "~15% dormidos reactivados",
                "Mejor ocupación y margen",
                "Dashboard actualizado a diario",
              ]
            : [
                "95% leads with origin",
                "−60% CEO admin time (measure baseline)",
                "~15% dormants reactivated",
                "Better occupancy & margin",
                "Daily-updated dashboard",
              ]
          ).map((k) => (
            <li
              key={k}
              className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2"
            >
              {k}
            </li>
          ))}
        </ul>
      </Card>

      <Card title={lang === "es" ? "Quick win 2–4 semanas" : "Quick win 2–4 weeks"}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4">
            <p className="flex items-center gap-2 font-semibold text-[var(--ink)]">
              <Zap className="h-4 w-4 text-[var(--accent)]" />{" "}
              {lang === "es" ? "Qué se entrega" : "What we ship"}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink-muted)]">
              <li>Data Hub mínimo + UTM</li>
              <li>Score v0 + owner</li>
              <li>Export top 15 + dormidos</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] p-4">
            <p className="flex items-center gap-2 font-semibold text-[var(--ink)]">
              <Target className="h-4 w-4 text-[var(--accent)]" />{" "}
              {lang === "es" ? "Cómo se mide" : "How we measure"}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--ink-muted)]">
              <li>% origen ↑ fuerte vs baseline</li>
              <li>Horas de triaje del CEO ↓</li>
              <li>Contactos humanos sobre la lista</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card title={lang === "es" ? "Equipo / interlocutores" : "Team / stakeholders"}>
        <ul className="grid gap-2 sm:grid-cols-2">
          {TEAM.map((person) => (
            <li
              key={person.name}
              className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm"
            >
              <span className="font-semibold text-[var(--ink)]">{person.name}</span>
              <span className="text-[var(--ink-muted)]"> — {person.role}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title={lang === "es" ? "Mensaje de cierre" : "Closing message"}>
        <p className="text-sm leading-relaxed text-[var(--ink)] md:text-base">
          {lang === "es" ? (
            <>
              No propongo sustituir el trato humano. Propongo automatizar todo lo que ocurre{" "}
              <strong>detrás del escenario</strong> para que Miguel Checa y su equipo dediquen más
              tiempo a lo que diferencia a 30 MPS: la confianza, el trato personal y una experiencia
              premium. La IA aporta información y eficiencia;{" "}
              <strong>las personas siguen construyendo la confianza</strong>.
            </>
          ) : (
            <>
              I don’t propose replacing human care. I propose automating everything that happens{" "}
              <strong>backstage</strong> so Miguel Checa and his team spend more time on what makes
              30 MPS different: trust, personal care and a premium experience. AI brings insight and
              efficiency; <strong>people still build the trust</strong>.
            </>
          )}
        </p>
      </Card>

      <Card title={lang === "es" ? "Supuestos explícitos" : "Explicit assumptions"}>
        <ul className="space-y-2">
          {MPS_ASSUMPTIONS.map((a) => (
            <li
              key={a.id}
              className="rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-sm"
            >
              <span className="font-semibold text-[var(--ink)]">{a.label}:</span>{" "}
              <span className="text-[var(--accent)]">{a.value}</span>
              <span className="text-[var(--ink-muted)]"> — {a.rationale}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SlidesPanel({ lang }: { lang: Lang }) {
  const slides = SLIDES[lang];
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [lang]);
  const slide = slides[i];

  return (
    <div className="glass-panel relative overflow-hidden rounded-3xl p-6 md:min-h-[420px] md:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-muted)]">
        {i + 1} {t(lang, "slides_of")} {slides.length}
      </p>
      <h2 className="mt-4 font-[family-name:var(--mps-display)] text-3xl text-[var(--ink)] md:text-5xl">
        {slide.title}
      </h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--ink-muted)] md:text-xl">
        {slide.body}
      </p>
      {slide.bullets && (
        <ul className="mt-6 space-y-2">
          {slide.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-[var(--ink)] md:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              {b}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={i === 0}
          onClick={() => setI((v) => Math.max(0, v - 1))}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2 text-sm font-semibold text-[var(--ink)] disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> {t(lang, "slides_prev")}
        </button>
        <button
          type="button"
          disabled={i === slides.length - 1}
          onClick={() => setI((v) => Math.min(slides.length - 1, v + 1))}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {t(lang, "slides_next")} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={cn(
              "h-2 rounded-full transition-all",
              idx === i ? "w-8 bg-[var(--accent)]" : "w-2 bg-[color-mix(in_oklab,var(--ink)_25%,transparent)]",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function MpsCrmApp() {
  const [section, setSection] = useState<Section>("hub");
  const [lang, setLang] = useState<Lang>("es");
  const [theme, setTheme] = useState<Theme>("light");
  const [collapsed, setCollapsed] = useState(false);
  const hub = useDataHub();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = "light";
  }, []);

  if (!hub.ready) {
    return (
      <div className="mps-crm mps-bg flex min-h-screen items-center justify-center text-[var(--ink)]">
        <p className="text-sm text-[var(--ink-muted)]">Cargando Data Hub…</p>
      </div>
    );
  }

  return (
    <div className="mps-crm mps-bg relative min-h-screen">
      <aside
        className={cn(
          "glass-sidebar fixed inset-y-0 left-0 z-40 flex flex-col transition-[width]",
          collapsed ? "w-[80px]" : "w-[240px]",
        )}
      >
        <div className={cn("border-b border-white/10", collapsed ? "px-2 py-3" : "px-3 py-4")}>
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-11 w-11 flex-col items-center justify-center rounded-xl bg-[var(--accent)] text-center shadow-md"
                title="30 MPS Adventures"
              >
                <span className="font-[family-name:var(--mps-display)] text-base leading-none font-bold text-white">
                  30
                </span>
                <span className="mt-0.5 text-[8px] font-bold tracking-[0.12em] text-white/95">
                  MPS
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="rounded-lg border border-white/20 bg-white/10 p-1.5 text-white hover:bg-white/20"
                aria-label="Expandir menú"
                title="Expandir menú"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2.5 px-1">
                <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--accent)] text-center shadow-md">
                  <span className="font-[family-name:var(--mps-display)] text-sm leading-none font-bold text-white">
                    30
                  </span>
                  <span className="mt-0.5 text-[7px] font-bold tracking-[0.12em] text-white/95">
                    MPS
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-[family-name:var(--mps-display)] text-xl tracking-tight text-white">
                    30 MPS
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-[var(--sidebar-muted)]">
                    {t(lang, "brand_sub")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="shrink-0 rounded-lg border border-white/20 bg-white/10 p-1.5 text-white hover:bg-white/20"
                aria-label="Compactar menú"
                title="Compactar menú"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {NAV_IDS.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={t(lang, item.labelKey)}
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition",
                  collapsed && "justify-center px-2",
                  active
                    ? "bg-white text-slate-900"
                    : "text-slate-200 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{t(lang, item.labelKey)}</span>}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-2">
          <div className={cn("rounded-xl border border-white/15 bg-white/10 p-2", collapsed && "px-1")}>
            {!collapsed && (
              <p className="mb-1 px-1 text-[10px] uppercase tracking-wide text-slate-400">
                {t(lang, "theme")}
              </p>
            )}
            <div className={cn("flex gap-1", collapsed && "flex-col")}>
              <button
                type="button"
                title={t(lang, "theme_light")}
                onClick={() => setTheme("light")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold",
                  theme === "light" ? "bg-white text-slate-900" : "text-slate-300 hover:bg-white/10",
                )}
              >
                <Sun className="h-3.5 w-3.5" />
                {!collapsed && t(lang, "theme_light")}
              </button>
              <button
                type="button"
                title={t(lang, "theme_dark")}
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold",
                  theme === "dark" ? "bg-white text-slate-900" : "text-slate-300 hover:bg-white/10",
                )}
              >
                <Moon className="h-3.5 w-3.5" />
                {!collapsed && t(lang, "theme_dark")}
              </button>
            </div>
          </div>

          <div className={cn("rounded-xl border border-white/15 bg-white/10 p-2", collapsed && "px-1")}>
            {!collapsed && (
              <p className="mb-1 px-1 text-[10px] uppercase tracking-wide text-slate-400">
                {t(lang, "lang")}
              </p>
            )}
            <div className={cn("flex gap-1", collapsed && "flex-col")}>
              {(["es", "en"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={cn(
                    "flex-1 rounded-lg px-2 py-1.5 text-xs font-bold uppercase",
                    lang === code ? "bg-white text-slate-900" : "text-slate-300 hover:bg-white/10",
                  )}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {!collapsed && (
            <div className="rounded-xl bg-white/10 p-3 text-[11px] leading-relaxed text-slate-200">
              <Activity className="mb-2 h-3.5 w-3.5" />
              {GOLDEN_RULE}
            </div>
          )}
        </div>
      </aside>

      <div
        className={cn(
          "relative min-h-screen transition-[margin]",
          collapsed ? "ml-[80px]" : "ml-[240px]",
        )}
      >
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--glass-border)] bg-[var(--header)] px-4 py-3 backdrop-blur-xl md:px-6">
          <div>
            <p className="text-sm font-semibold text-[var(--ink)]">
              {t(lang, NAV_IDS.find((n) => n.id === section)?.labelKey ?? "nav_hub")}
            </p>
            <p className="text-xs text-[var(--ink-muted)]">{t(lang, "internal_only")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="glass-chip rounded-md px-2 py-1 text-xs font-semibold">
              {hub.mode === "supabase"
                ? t(lang, "live_badge_supabase")
                : hub.meta?.seededFromDemo
                  ? t(lang, "live_badge_local_seed")
                  : t(lang, "live_badge_local")}
            </span>
            <span className="glass-chip rounded-md px-2 py-1 text-xs font-semibold">
              {t(lang, "no_client_msgs")}
            </span>
          </div>
        </header>

        <main className="px-4 py-5 md:px-6 md:py-6">
          {section === "hub" && <HubPanel lang={lang} />}
          {section === "dashboard" && <DashboardPanel lang={lang} theme={theme} />}
          {section === "leads" && <LeadsPanel lang={lang} />}
          {section === "clientes" && <ClientsPanel lang={lang} />}
          {section === "reservas" && <ReservationsPanel lang={lang} />}
          {section === "facturas" && <InvoicesVerifactuPanel lang={lang} />}
          {section === "contenido" && <ContentFactoryPanel lang={lang} />}
          {section === "conocimiento" && <KnowledgePanel lang={lang} />}
          {section === "automatizaciones" && <AutomationsPanel lang={lang} />}
          {section === "propuesta" && <ProposalPanel lang={lang} />}
          {section === "slides" && <SlidesPanel lang={lang} />}

          <footer className="mt-8 flex flex-wrap items-center gap-2 border-t border-[var(--glass-border)] pt-4 text-xs text-[var(--ink-muted)]">
            <Lightbulb className="h-3.5 w-3.5" />
            {t(lang, "footer")} · {COMPANY.legal}
          </footer>
        </main>
      </div>
    </div>
  );
}
