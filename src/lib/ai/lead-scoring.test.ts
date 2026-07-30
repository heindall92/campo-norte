import { describe, expect, it } from "vitest";
import { priorityFromScore, scoreLeadHeuristic } from "@/lib/ai/lead-scoring";
import type { Lead } from "@/lib/demo-data";
import {
  isReavPriceShape,
  reavVatAmount,
  reavVatMatches,
} from "@/lib/invoice-math";
import { buildGestoriaExportCsv, INVOICES } from "@/lib/ops-data";

function baseLead(over: Partial<Lead> = {}): Lead {
  return {
    id: "L-TEST",
    name: "Test Lead",
    email: "test@example.com",
    origin: "unknown",
    campaign: null,
    interestRoute: null,
    vehicle: null,
    status: "nuevo",
    score: 0,
    scoreReasons: [],
    owner: "Miguel",
    createdAt: "2026-01-01",
    lastTouchAt: "2026-01-01",
    ...over,
  };
}

describe("lead scoring heuristic", () => {
  it("priorityFromScore bands", () => {
    expect(priorityFromScore(90)).toBe("muy_alta");
    expect(priorityFromScore(75)).toBe("alta");
    expect(priorityFromScore(55)).toBe("media");
    expect(priorityFromScore(40)).toBe("baja");
  });

  it("boosts referral + destination over unknown", () => {
    const cold = scoreLeadHeuristic(baseLead({ origin: "unknown" }));
    const hot = scoreLeadHeuristic(
      baseLead({
        origin: "referral",
        interestRoute: "MONGOLIA",
        status: "cualificado",
      }),
    );
    expect(hot.score).toBeGreaterThan(cold.score);
    expect(hot.source).toBe("heuristic");
    expect(hot.reasons.some((r) => /refer|Canal/i.test(r))).toBe(true);
  });

  it("clamps score to 0–100", () => {
    const r = scoreLeadHeuristic(
      baseLead({
        origin: "referral",
        interestRoute: "MONGOLIA",
        vehicle: "moto",
        campaign: "NL",
        status: "reservado",
      }),
    );
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});

describe("REAV invoice math", () => {
  it("computes VAT on margin (tax base), not on total", () => {
    expect(reavVatAmount(410, 21)).toBe(86.1);
    expect(reavVatMatches(410, 21, 86.1)).toBe(true);
    expect(reavVatMatches(410, 21, 99)).toBe(false);
  });

  it("allows total > taxBase + VAT (REAV shape)", () => {
    expect(isReavPriceShape(410, 86.1, 1500)).toBe(true);
    expect(isReavPriceShape(900, 189, 1000)).toBe(false);
  });

  it("seed invoices keep REAV VAT coherence", () => {
    for (const inv of INVOICES) {
      expect(reavVatMatches(inv.taxBase, inv.vatRate, inv.vatAmount)).toBe(true);
      expect(isReavPriceShape(inv.taxBase, inv.vatAmount, inv.total)).toBe(true);
    }
  });

  it("gestoría CSV includes header and one row per invoice", () => {
    const csv = buildGestoriaExportCsv(INVOICES);
    const lines = csv.trim().split(/\r?\n/);
    expect(lines[0]).toContain("numero_factura");
    expect(lines.length).toBe(INVOICES.length + 1);
  });
});
