import { describe, expect, it } from "vitest";
import { buildWmsSeed, computeTowerKpis, occupancyByZone, stockByCategory } from "@/lib/wms";

describe("wms seed & stats", () => {
  it("builds a usable warehouse snapshot", () => {
    const snap = buildWmsSeed();
    expect(snap.sites.length).toBeGreaterThanOrEqual(1);
    expect(snap.slots.length).toBeGreaterThan(50);
    expect(snap.pallets.length).toBeGreaterThan(10);
    expect(snap.fleet.length).toBeGreaterThan(3);
    expect(snap.operators.length).toBeGreaterThan(5);
  });

  it("computes tower KPIs", () => {
    const kpis = computeTowerKpis(buildWmsSeed());
    expect(kpis.occupancyPct).toBeGreaterThan(0);
    expect(kpis.palletsLive).toBeGreaterThan(0);
    expect(kpis.operatorsActive).toBeGreaterThan(0);
    expect(kpis.costMonthEur).toBeGreaterThan(0);
  });

  it("groups occupancy and stock", () => {
    const snap = buildWmsSeed();
    const occ = occupancyByZone(snap.slots);
    const stock = stockByCategory(snap.pallets, snap.skus, "es");
    expect(occ.some((z) => z.zone === "seco")).toBe(true);
    expect(stock.length).toBeGreaterThan(0);
  });
});
