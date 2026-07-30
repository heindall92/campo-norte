import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Client, Lead } from "@/lib/demo-data";
import type { Invoice, Reservation } from "@/lib/ops-data";
import {
  exportClientsCsv,
  exportLeadsCsv,
  importClientsFromCsv,
  importLeadsFromCsv,
} from "./csv";
import { LocalDataStore } from "./local-store";
import { buildSeedSnapshot } from "./seed";
import { preferredDataMode, SupabaseDataStore } from "./supabase-store";
import type { DataMode, DataStore, HubMeta, HubSnapshot, ImportResult } from "./types";

type PersistSlice = Partial<
  Pick<HubSnapshot, "leads" | "clients" | "reservations" | "invoices">
>;

export interface DataHubContextValue {
  ready: boolean;
  loading: boolean;
  error: string | null;
  mode: DataMode;
  meta: HubMeta | null;
  leads: Lead[];
  clients: Client[];
  reservations: Reservation[];
  invoices: Invoice[];
  saveLead: (lead: Lead) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  saveClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  saveReservation: (reservation: Reservation) => Promise<void>;
  deleteReservation: (id: string) => Promise<void>;
  saveInvoice: (invoice: Invoice) => Promise<void>;
  importLeadsCsv: (text: string) => Promise<ImportResult>;
  importClientsCsv: (text: string) => Promise<ImportResult>;
  importSnapshotJson: (text: string) => Promise<void>;
  exportSnapshot: () => HubSnapshot;
  getLeadsCsv: () => string;
  getClientsCsv: () => string;
  resetToSeed: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

const DataHubContext = createContext<DataHubContextValue | null>(null);

function createStore(): DataStore {
  const mode = preferredDataMode();
  if (mode === "supabase") {
    const remote = new SupabaseDataStore();
    if (remote.isConfigured()) return remote;
  }
  return new LocalDataStore();
}

function upsertById<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) {
    const next = [...list];
    next[idx] = item;
    return next;
  }
  return [item, ...list];
}

export function DataHubProvider({ children }: { children: ReactNode }) {
  const [store] = useState<DataStore>(() => createStore());
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<HubSnapshot | null>(null);
  const snapshotRef = useRef<HubSnapshot | null>(null);

  useEffect(() => {
    snapshotRef.current = snapshot;
  }, [snapshot]);

  const persist = useCallback(
    async (slice: PersistSlice, metaPatch?: Partial<HubMeta>) => {
      const prev = snapshotRef.current;
      if (!prev) return;
      const next: HubSnapshot = {
        ...prev,
        ...slice,
        meta: {
          ...prev.meta,
          ...metaPatch,
          seededFromDemo: metaPatch?.seededFromDemo ?? false,
          updatedAt: new Date().toISOString(),
          lastSyncedAt: new Date().toISOString(),
        },
      };
      snapshotRef.current = next;
      setSnapshot(next);
      try {
        await store.save(next);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar en el Data Hub");
        throw err;
      }
    },
    [store],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await store.load();
      snapshotRef.current = data;
      setSnapshot(data);
    } catch (err) {
      if (store.mode === "supabase") {
        try {
          const local = new LocalDataStore();
          const data = await local.load();
          snapshotRef.current = data;
          setSnapshot(data);
          setError(
            `Supabase no disponible (${err instanceof Error ? err.message : "error"}). Usando Data Hub local.`,
          );
        } catch (localErr) {
          const seed = buildSeedSnapshot("local");
          snapshotRef.current = seed;
          setSnapshot(seed);
          setError(localErr instanceof Error ? localErr.message : "No se pudo cargar el Hub");
        }
      } else {
        const seed = buildSeedSnapshot("local");
        snapshotRef.current = seed;
        setSnapshot(seed);
        setError(err instanceof Error ? err.message : "No se pudo cargar el Hub");
      }
    } finally {
      setLoading(false);
      setReady(true);
    }
  }, [store]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<DataHubContextValue>(() => {
    const leads = snapshot?.leads ?? [];
    const clients = snapshot?.clients ?? [];
    const reservations = snapshot?.reservations ?? [];
    const invoices = snapshot?.invoices ?? [];
    const meta = snapshot?.meta ?? null;

    return {
      ready,
      loading,
      error,
      mode: store.mode,
      meta,
      leads,
      clients,
      reservations,
      invoices,
      clearError: () => setError(null),
      refresh,
      saveLead: async (lead) => {
        const current = snapshotRef.current?.leads ?? [];
        await persist({ leads: upsertById(current, lead) });
      },
      deleteLead: async (id) => {
        const current = snapshotRef.current?.leads ?? [];
        await persist({ leads: current.filter((l) => l.id !== id) });
      },
      saveClient: async (client) => {
        const current = snapshotRef.current?.clients ?? [];
        await persist({ clients: upsertById(current, client) });
      },
      deleteClient: async (id) => {
        const current = snapshotRef.current?.clients ?? [];
        await persist({ clients: current.filter((c) => c.id !== id) });
      },
      saveReservation: async (reservation) => {
        const current = snapshotRef.current?.reservations ?? [];
        await persist({ reservations: upsertById(current, reservation) });
      },
      deleteReservation: async (id) => {
        const current = snapshotRef.current;
        await persist({
          reservations: (current?.reservations ?? []).filter((r) => r.id !== id),
          invoices: (current?.invoices ?? []).filter((inv) => inv.reservationId !== id),
        });
      },
      saveInvoice: async (invoice) => {
        const current = snapshotRef.current?.invoices ?? [];
        await persist({ invoices: upsertById(current, invoice) });
      },
      importLeadsCsv: async (text) => {
        const current = snapshotRef.current?.leads ?? [];
        const result = importLeadsFromCsv(text, current);
        await persist({ leads: result.leads });
        return { added: result.added, updated: result.updated, errors: result.errors };
      },
      importClientsCsv: async (text) => {
        const current = snapshotRef.current?.clients ?? [];
        const result = importClientsFromCsv(text, current);
        await persist({ clients: result.clients });
        return { added: result.added, updated: result.updated, errors: result.errors };
      },
      importSnapshotJson: async (text) => {
        const parsed = JSON.parse(text) as HubSnapshot;
        if (!parsed?.leads || !parsed?.clients) {
          throw new Error("JSON inválido: se esperaba un snapshot del Hub");
        }
        const next: HubSnapshot = {
          ...parsed,
          meta: {
            ...parsed.meta,
            mode: store.mode,
            seededFromDemo: false,
            updatedAt: new Date().toISOString(),
            lastSyncedAt: new Date().toISOString(),
          },
        };
        await store.save(next);
        snapshotRef.current = next;
        setSnapshot(next);
      },
      exportSnapshot: () => snapshotRef.current ?? buildSeedSnapshot(store.mode),
      getLeadsCsv: () => exportLeadsCsv(snapshotRef.current?.leads ?? []),
      getClientsCsv: () => exportClientsCsv(snapshotRef.current?.clients ?? []),
      resetToSeed: async () => {
        const seed = buildSeedSnapshot(store.mode);
        await store.save(seed);
        snapshotRef.current = seed;
        setSnapshot(seed);
      },
    };
  }, [ready, loading, error, snapshot, store, persist, refresh]);

  return <DataHubContext.Provider value={value}>{children}</DataHubContext.Provider>;
}

export function useDataHub(): DataHubContextValue {
  const ctx = useContext(DataHubContext);
  if (!ctx) {
    throw new Error("useDataHub debe usarse dentro de DataHubProvider");
  }
  return ctx;
}
