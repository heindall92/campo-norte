/** Dominio WMS — Campo Norte Logística (fase 1). */

export type WarehouseZone = "seco" | "fresco" | "congelado" | "picking" | "muelle" | "crossdock";

export type SlotStatus = "libre" | "ocupado" | "reservado" | "bloqueado" | "inventario";

export type PalletStatus = "en_ubicacion" | "en_transito" | "picking" | "muelle" | "expedido" | "cuarentena";

export type CategoryCode =
  | "alimentacion_seca"
  | "frescos"
  | "congelados"
  | "bebidas"
  | "no_food"
  | "perecederos";

export type FleetKind = "contrapesada" | "retractil" | "transpaleta" | "recogepedidos" | "apilador";

export type FleetStatus = "operativa" | "cargando" | "mantenimiento" | "fuera_servicio";

export type ShiftCode = "manana" | "tarde" | "noche";

export type OperatorRoleFloor = "carretillero" | "picker" | "recepcion" | "expedicion" | "supervisor" | "calidad";

export type MovementType = "entrada" | "salida" | "traslado" | "ajuste" | "inventario";

export interface WarehouseSite {
  id: string;
  code: string;
  name: string;
  city: string;
  region: string;
  country: string;
  sqm: number;
  slotsTotal: number;
  temperatureModes: WarehouseZone[];
}

export interface Sku {
  id: string;
  sku: string;
  name: string;
  category: CategoryCode;
  uom: "ud" | "caja" | "kg" | "palet";
  unitsPerPallet: number;
  weightKg: number;
  abc: "A" | "B" | "C";
  minStock: number;
  maxStock: number;
}

export interface Slot {
  id: string;
  code: string; // A-12-03-02
  siteId: string;
  zone: WarehouseZone;
  aisle: string;
  rack: number;
  level: number;
  status: SlotStatus;
  capacityPallets: number;
  palletId: string | null;
  lastCountedAt: string | null;
}

export interface Pallet {
  id: string;
  sscc: string;
  skuId: string;
  qty: number;
  lot: string;
  expiry: string | null;
  status: PalletStatus;
  slotId: string | null;
  siteId: string;
  receivedAt: string;
  supplier: string;
}

export interface FleetUnit {
  id: string;
  code: string;
  brand: string;
  model: string;
  kind: FleetKind;
  status: FleetStatus;
  batteryPct: number;
  hoursToday: number;
  hoursTotal: number;
  operatorId: string | null;
  siteId: string;
  nextServiceAt: string;
  costPerHour: number;
}

export interface Operator {
  id: string;
  code: string;
  name: string;
  role: OperatorRoleFloor;
  shift: ShiftCode;
  siteId: string;
  active: boolean;
  certifications: string[];
  costPerHour: number;
  picksPerHour: number;
  movesToday: number;
  hoursToday: number;
  overtimeHoursWeek: number;
  hiredAt: string;
}

export interface InboundAsn {
  id: string;
  code: string;
  supplier: string;
  eta: string;
  dock: string;
  status: "previsto" | "en_muelle" | "descargando" | "ubicando" | "cerrado";
  lines: number;
  palletsExpected: number;
  palletsDone: number;
  siteId: string;
}

export interface OutboundOrder {
  id: string;
  code: string;
  customer: string;
  cutOff: string;
  dock: string;
  status: "pendiente" | "picking" | "embalaje" | "muelle" | "expedido";
  lines: number;
  pallets: number;
  priority: "normal" | "urgente" | "express";
  siteId: string;
}

export interface CostLine {
  id: string;
  month: string; // YYYY-MM
  siteId: string;
  center: "mano_obra" | "energia" | "flota" | "espacio" | "merma" | "terceros" | "it";
  label: string;
  amountEur: number;
  budgetEur: number;
}

export interface StockMovement {
  id: string;
  at: string;
  type: MovementType;
  skuId: string;
  palletId: string | null;
  fromSlotId: string | null;
  toSlotId: string | null;
  qty: number;
  operatorId: string | null;
  fleetId: string | null;
  note: string;
}

export interface WmsSnapshot {
  sites: WarehouseSite[];
  skus: Sku[];
  slots: Slot[];
  pallets: Pallet[];
  fleet: FleetUnit[];
  operators: Operator[];
  inbound: InboundAsn[];
  outbound: OutboundOrder[];
  costs: CostLine[];
  movements: StockMovement[];
}

export const CATEGORY_LABEL: Record<CategoryCode, { es: string; en: string }> = {
  alimentacion_seca: { es: "Alimentación seca", en: "Dry grocery" },
  frescos: { es: "Frescos", en: "Fresh" },
  congelados: { es: "Congelados", en: "Frozen" },
  bebidas: { es: "Bebidas", en: "Beverages" },
  no_food: { es: "No food", en: "Non-food" },
  perecederos: { es: "Perecederos", en: "Perishables" },
};

export const ZONE_LABEL: Record<WarehouseZone, { es: string; en: string }> = {
  seco: { es: "Seco", en: "Dry" },
  fresco: { es: "Fresco", en: "Fresh" },
  congelado: { es: "Congelado", en: "Frozen" },
  picking: { es: "Picking", en: "Picking" },
  muelle: { es: "Muelle", en: "Dock" },
  crossdock: { es: "Cross-dock", en: "Cross-dock" },
};

export const FLEET_KIND_LABEL: Record<FleetKind, { es: string; en: string }> = {
  contrapesada: { es: "Contrapesada", en: "Counterbalance" },
  retractil: { es: "Retráctil", en: "Reach truck" },
  transpaleta: { es: "Transpaleta", en: "Pallet truck" },
  recogepedidos: { es: "Recogepedidos", en: "Order picker" },
  apilador: { es: "Apilador", en: "Stacker" },
};

export const WMS_STORAGE_KEY = "cn-wms-hub-v1";
