import { Badge, Card } from "@/components/CrmChrome";
import type { Lang } from "@/lib/i18n";
import {
  loadWmsSnapshot,
  saveWmsSnapshot,
  type PickLine,
  type PickWave,
  type Slot,
  type WmsSnapshot,
} from "@/lib/wms";
import { cn } from "@/lib/utils";
import { Check, ScanBarcode, ChevronRight, MapPin, Package } from "lucide-react";
import { useMemo, useState } from "react";

function useWmsLive(): [WmsSnapshot, (next: WmsSnapshot) => void] {
  const [snap, setSnap] = useState(() => loadWmsSnapshot());
  function update(next: WmsSnapshot) {
    saveWmsSnapshot(next);
    setSnap(next);
  }
  return [snap, update];
}

/** Vista pasillo: rack selectivo (montantes + 2 palets/bahía + niveles). */
export function WmsAisleView({
  lang,
  aisle,
  highlightSlotId,
  onSelectSlot,
}: {
  lang: Lang;
  aisle: string;
  highlightSlotId?: string | null;
  onSelectSlot?: (slot: Slot) => void;
}) {
  const [snap] = useWmsLive();
  const slots = snap.slots.filter((s) => s.aisle === aisle && s.siteId === snap.sites[0]?.id);
  const racks = [...new Set(slots.map((s) => s.rack))].sort((a, b) => a - b);
  const levels = [...new Set(slots.map((s) => s.level))].sort((a, b) => b - a);
  const palletMap = useMemo(() => new Map(snap.pallets.map((p) => [p.id, p])), [snap.pallets]);
  const skuMap = useMemo(() => new Map(snap.skus.map((s) => [s.id, s])), [snap.skus]);

  return (
    <div className="wms-aisle overflow-x-auto rounded-2xl border border-[var(--glass-border)] bg-[linear-gradient(180deg,#1e293b_0%,#334155_40%,#64748b_100%)] p-3 shadow-inner">
      <div className="mb-2 flex items-center justify-between px-1 text-xs text-white/80">
        <span className="font-semibold tracking-wide">
          {lang === "es" ? "Pasillo" : "Aisle"} {aisle}
        </span>
        <span>
          {racks.length} {lang === "es" ? "bahías" : "bays"} · {levels.length}{" "}
          {lang === "es" ? "niveles" : "levels"}
        </span>
      </div>

      <div className="flex min-w-max gap-1.5 pb-2">
        {racks.map((rack, rackIdx) => (
          <div
            key={rack}
            className="wms-bay flex w-[7.5rem] flex-col gap-1"
            style={{ animationDelay: `${rackIdx * 40}ms` }}
          >
            {levels.map((level) => {
              const left = slots.find((s) => s.rack === rack && s.level === level && s.position === 1);
              const right = slots.find((s) => s.rack === rack && s.level === level && s.position === 2);
              return (
                <div key={`${rack}-${level}`} className="relative">
                  {/* Travesaño naranja */}
                  <div className="absolute inset-x-0 top-0 z-10 h-1 rounded-sm bg-[#f97316] shadow-[0_0_8px_rgba(249,115,22,0.45)]" />
                  <div className="flex gap-0.5 rounded-sm border-x-[3px] border-[#1d4ed8] bg-[#0f172a]/80 px-0.5 pb-0.5 pt-1.5">
                    {[left, right].map((slot, i) => {
                      if (!slot) {
                        return <div key={i} className="h-14 flex-1 rounded-sm bg-black/20" />;
                      }
                      const pallet = slot.palletId ? palletMap.get(slot.palletId) : null;
                      const sku = pallet ? skuMap.get(pallet.skuId) : null;
                      const active = highlightSlotId === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => onSelectSlot?.(slot)}
                          className={cn(
                            "group relative h-14 flex-1 overflow-hidden rounded-sm border text-left transition",
                            slot.status === "libre" && "border-emerald-500/40 bg-emerald-900/30",
                            slot.status === "ocupado" && "border-white/20 bg-[#f8fafc]",
                            slot.status === "reservado" && "border-amber-400/50 bg-amber-100",
                            slot.status === "bloqueado" && "border-red-500/50 bg-red-900/40",
                            active && "ring-2 ring-[#fbbf24] ring-offset-1 ring-offset-[#1e293b]",
                            slot.pickFace && "shadow-[inset_0_-6px_0_0_rgba(251,191,36,0.35)]",
                          )}
                          title={`${slot.code} · ${sku?.name ?? slot.status}`}
                        >
                          {pallet ? (
                            <div className="flex h-full flex-col justify-between p-1">
                              <span className="line-clamp-2 text-[8px] font-semibold leading-tight text-slate-800">
                                {sku?.name ?? "—"}
                              </span>
                              <span className="font-mono text-[7px] text-slate-500">{slot.code}</span>
                            </div>
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="font-mono text-[8px] text-white/50">{slot.code}</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {level === 1 && (
                    <p className="mt-0.5 text-center text-[8px] font-bold uppercase tracking-wider text-amber-200/90">
                      {lang === "es" ? "picking" : "pick face"}
                    </p>
                  )}
                </div>
              );
            })}
            <p className="pt-1 text-center font-mono text-[10px] font-bold text-white/70">
              {aisle}-{String(rack).padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-2 h-2 rounded-full bg-[linear-gradient(90deg,#94a3b8,#cbd5e1,#94a3b8)] opacity-80" />
      <p className="mt-1 text-center text-[10px] text-white/60">
        {lang === "es" ? "Suelo de pasillo · línea de seguridad" : "Aisle floor · safety line"}
      </p>
    </div>
  );
}

export function WmsSlotsPanel({ lang }: { lang: Lang }) {
  const [snap] = useWmsLive();
  const [aisle, setAisle] = useState("A");
  const [selected, setSelected] = useState<Slot | null>(null);
  const aisles = [...new Set(snap.slots.map((s) => s.aisle))].filter((a) => a !== "M");
  const pallet = selected?.palletId ? snap.pallets.find((p) => p.id === selected.palletId) : null;
  const sku = pallet ? snap.skus.find((s) => s.id === pallet.skuId) : null;

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--mps-display)] text-2xl text-[var(--ink)]">
            {lang === "es" ? "Pasillos y huecos" : "Aisles & slots"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--ink-muted)]">
            {lang === "es"
              ? "Rack selectivo: montantes · 2 palets por bahía · nivel 1 = cara de picking · arriba = reserva."
              : "Selective rack: uprights · 2 pallets per bay · level 1 = pick face · above = reserve."}
          </p>
        </div>
        <select
          className="rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] px-3 py-2 text-sm"
          value={aisle}
          onChange={(e) => {
            setAisle(e.target.value);
            setSelected(null);
          }}
        >
          {aisles.map((a) => (
            <option key={a} value={a}>
              {lang === "es" ? "Pasillo" : "Aisle"} {a}
            </option>
          ))}
        </select>
      </header>

      <WmsAisleView
        lang={lang}
        aisle={aisle}
        highlightSlotId={selected?.id}
        onSelectSlot={setSelected}
      />

      {selected && (
        <Card
          title={selected.code}
          subtitle={
            selected.pickFace
              ? lang === "es"
                ? "Cara de picking"
                : "Pick face"
              : lang === "es"
                ? "Reserva alta"
                : "High reserve"
          }
        >
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{selected.status}</Badge>
            <Badge tone="neutral">
              {lang === "es" ? "Pos" : "Pos"} {selected.position}
            </Badge>
            <Badge tone="neutral">
              {lang === "es" ? "Nivel" : "Level"} {selected.level}
            </Badge>
          </div>
          {sku ? (
            <p className="mt-3 text-sm text-[var(--ink)]">
              <span className="font-semibold">{sku.name}</span>
              <span className="text-[var(--ink-muted)]">
                {" "}
                · {pallet?.sscc} · {lang === "es" ? "lote" : "lot"} {pallet?.lot} · qty {pallet?.qty}
              </span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-[var(--ink-muted)]">
              {lang === "es" ? "Hueco libre" : "Empty slot"}
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

function nextOpenLine(wave: PickWave): PickLine | null {
  return (
    wave.lines.find((l) => l.status === "en_curso") ??
    wave.lines.find((l) => l.status === "pendiente") ??
    null
  );
}

/** Flujo operario: ticket → hueco → escáner → confirmar. */
export function WmsPickingPanel({ lang }: { lang: Lang }) {
  const [snap, setSnap] = useWmsLive();
  const [waveId, setWaveId] = useState(snap.pickWaves[0]?.id ?? "");
  const wave = snap.pickWaves.find((w) => w.id === waveId) ?? snap.pickWaves[0];
  const line = wave ? nextOpenLine(wave) : null;
  const slot = line ? snap.slots.find((s) => s.id === line.slotId) : null;
  const sku = line ? snap.skus.find((s) => s.id === line.skuId) : null;
  const pallet = line?.palletId ? snap.pallets.find((p) => p.id === line.palletId) : null;

  const [scanSlot, setScanSlot] = useState("");
  const [scanSscc, setScanSscc] = useState("");
  const [qty, setQty] = useState(line?.qty ?? 0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const done = wave?.lines.filter((l) => l.status === "picada").length ?? 0;
  const total = wave?.lines.length ?? 0;

  function patchLine(status: PickLine["status"], qtyPicked?: number) {
    if (!wave || !line) return;
    const nextLines = wave.lines.map((l) =>
      l.id === line.id
        ? { ...l, status, qtyPicked: qtyPicked ?? l.qtyPicked }
        : l.status === "pendiente" && status === "picada" && l.sequence === line.sequence + 1
          ? { ...l, status: "en_curso" as const }
          : l,
    );
    const allDone = nextLines.every((l) => l.status === "picada" || l.status === "omitida");
    const nextWave: PickWave = {
      ...wave,
      status: allDone ? "cerrada" : "en_curso",
      lines: nextLines,
    };
    const next: WmsSnapshot = {
      ...snap,
      pickWaves: snap.pickWaves.map((w) => (w.id === nextWave.id ? nextWave : w)),
    };
    setSnap(next);
    setScanSlot("");
    setScanSscc("");
    setFeedback(null);
    const nxt = nextOpenLine(nextWave);
    setQty(nxt?.qty ?? 0);
  }

  function confirmPick() {
    if (!line || !slot || !pallet) return;
    if (scanSlot.trim().toUpperCase() !== slot.code.toUpperCase()) {
      setFeedback(lang === "es" ? "Hueco incorrecto — vuelve a escanear la ubicación" : "Wrong slot — rescan location");
      return;
    }
    if (scanSscc.trim() !== pallet.sscc) {
      setFeedback(lang === "es" ? "SSCC incorrecto — escanea la etiqueta del palet" : "Wrong SSCC — scan pallet label");
      return;
    }
    if (qty < 1 || qty > line.qty) {
      setFeedback(lang === "es" ? "Cantidad no válida" : "Invalid quantity");
      return;
    }
    patchLine("picada", qty);
  }

  if (!wave) {
    return (
      <Card title={lang === "es" ? "Sin olas de picking" : "No pick waves"}>
        <p className="text-sm text-[var(--ink-muted)]">
          {lang === "es" ? "No hay tickets impresos." : "No printed tickets."}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-[family-name:var(--mps-display)] text-2xl text-[var(--ink)]">
            {lang === "es" ? "Picar mercancía" : "Pick orders"}
          </h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            {lang === "es"
              ? "Ticket impreso → pasillo → escanear hueco → escanear SSCC → confirmar."
              : "Printed ticket → aisle → scan slot → scan SSCC → confirm."}
          </p>
        </div>
        <select
          className="rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] px-3 py-2 text-sm"
          value={wave.id}
          onChange={(e) => {
            setWaveId(e.target.value);
            setFeedback(null);
          }}
        >
          {snap.pickWaves.map((w) => (
            <option key={w.id} value={w.id}>
              {w.code} · {w.aisle} · {w.status}
            </option>
          ))}
        </select>
      </header>

      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
        <Card
          title={wave.code}
          subtitle={`${lang === "es" ? "Progreso" : "Progress"} ${done}/${total}`}
        >
          <div className="mb-3 h-2 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
              style={{ width: `${total ? (done / total) * 100 : 0}%` }}
            />
          </div>
          <ul className="space-y-2">
            {wave.lines.map((l) => {
              const s = snap.slots.find((x) => x.id === l.slotId);
              const sk = snap.skus.find((x) => x.id === l.skuId);
              const active = line?.id === l.id;
              return (
                <li
                  key={l.id}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm transition",
                    active
                      ? "border-[color-mix(in_oklab,var(--accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)]"
                      : "border-[var(--glass-border)] bg-[var(--surface-sunken)]",
                  )}
                >
                  <span className="min-w-0">
                    <span className="font-mono text-xs font-semibold">{s?.code}</span>
                    <span className="mt-0.5 block truncate text-[var(--ink-muted)]">{sk?.name}</span>
                  </span>
                  <Badge
                    tone={
                      l.status === "picada" ? "good" : l.status === "en_curso" ? "warn" : "neutral"
                    }
                  >
                    {l.qtyPicked}/{l.qty}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-3">
          {slot && line && sku && pallet ? (
            <>
              <Card title={lang === "es" ? "Siguiente hueco" : "Next slot"}>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge tone="brand">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    {slot.code}
                  </Badge>
                  <Badge tone="neutral">{sku.name}</Badge>
                  <Badge tone="warn">× {line.qty}</Badge>
                </div>
                <p className="text-xs text-[var(--ink-muted)]">
                  SSCC {pallet.sscc} · {lang === "es" ? "lote" : "lot"} {pallet.lot}
                </p>
              </Card>

              <WmsAisleView lang={lang} aisle={wave.aisle} highlightSlotId={slot.id} />

              <Card title={lang === "es" ? "Escáner" : "Scanner"}>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                  {lang === "es" ? "1. Escanea hueco" : "1. Scan slot"}
                  <div className="mt-1 flex items-center gap-2">
                    <ScanBarcode className="h-4 w-4 text-[var(--accent)]" />
                    <input
                      value={scanSlot}
                      onChange={(e) => setScanSlot(e.target.value)}
                      placeholder={slot.code}
                      className="w-full rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] px-3 py-2 font-mono text-sm"
                    />
                  </div>
                </label>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                  {lang === "es" ? "2. Escanea SSCC del palet" : "2. Scan pallet SSCC"}
                  <div className="mt-1 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--accent)]" />
                    <input
                      value={scanSscc}
                      onChange={(e) => setScanSscc(e.target.value)}
                      placeholder={pallet.sscc}
                      className="w-full rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] px-3 py-2 font-mono text-sm"
                    />
                  </div>
                </label>
                <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-[var(--ink-muted)]">
                  {lang === "es" ? "3. Cantidad" : "3. Quantity"}
                  <input
                    type="number"
                    min={1}
                    max={line.qty}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[var(--field-border)] bg-[var(--field-bg)] px-3 py-2 text-sm"
                  />
                </label>
                {feedback && (
                  <p className="mb-3 rounded-xl bg-[var(--warn-bg)] px-3 py-2 text-xs font-semibold text-[var(--warn-ink)]">
                    {feedback}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={confirmPick}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
                  >
                    <Check className="h-4 w-4" />
                    {lang === "es" ? "Confirmar picado" : "Confirm pick"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScanSlot(slot.code);
                      setScanSscc(pallet.sscc);
                      setQty(line.qty);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-2.5 text-sm font-semibold text-[var(--ink)]"
                  >
                    <ChevronRight className="h-4 w-4" />
                    {lang === "es" ? "Autocompletar demo" : "Autofill demo"}
                  </button>
                </div>
              </Card>
            </>
          ) : (
            <Card title={lang === "es" ? "Ola completada" : "Wave complete"}>
              <p className="text-sm text-[var(--ink-muted)]">
                {lang === "es"
                  ? "Todas las líneas picadas. Listo para muelle."
                  : "All lines picked. Ready for dock."}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
